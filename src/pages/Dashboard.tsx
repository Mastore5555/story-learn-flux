import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProgressCard } from '@/components/ProgressCard';
import { Brain, User, BookOpen, Award, Settings, LogOut, Play, Clock, Star, TrendingUp } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { getUserStats } = useProgress();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      const userStats = await getUserStats();
      setStats(userStats);
      setLoading(false);
    };

    if (user) {
      loadStats();
    }
  }, [user, getUserStats]);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="gradient-text text-xl font-bold">Techflix Academy</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback>
                {user?.user_metadata?.display_name 
                  ? getInitials(user.user_metadata.display_name)
                  : user?.email?.[0]?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="flex flex-col space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold tracking-tight">
              Olá, {user?.user_metadata?.display_name || 'Estudante'}! 👋
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {stats?.activeCourses > 0 
                ? `Continue seus ${stats.activeCourses} cursos em progresso`
                : 'Bem-vindo à sua área pessoal da Techflix Academy. Continue sua jornada de aprendizado!'
              }
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">
                      {loading ? "..." : stats?.activeCourses || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Cursos Ativos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-accent" />
                  <div>
                    <p className="text-2xl font-bold">
                      {loading ? "..." : `${Math.floor((stats?.totalWatchTime || 0) / 60)}h`}
                    </p>
                    <p className="text-sm text-muted-foreground">Tempo Estudado</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {loading ? "..." : stats?.completedCourses || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Concluídos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">
                      {loading ? "..." : stats?.favorites || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Favoritos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Visão Geral</TabsTrigger>
              <TabsTrigger value="courses">Meus Cursos</TabsTrigger>
              <TabsTrigger value="profile">Meu Perfil</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Continue Assistindo</CardTitle>
                    <CardDescription>
                      Retome seus estudos de onde parou
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {loading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      </div>
                    ) : stats?.recentProgress?.length > 0 ? (
                      <div className="space-y-4">
                        {stats.recentProgress.slice(0, 2).map((progress: any) => (
                          <div key={progress.id} className="flex items-center space-x-3 p-3 rounded-lg border">
                            <img 
                              src={progress.course?.thumbnail_url || '/placeholder.svg'} 
                              alt={progress.course?.title}
                              className="w-16 h-12 object-cover rounded"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium truncate">{progress.course?.title}</h4>
                              <div className="flex items-center mt-1">
                                <div className="flex-1 bg-secondary rounded-full h-2 mr-2">
                                  <div 
                                    className="bg-primary h-2 rounded-full" 
                                    style={{ width: `${progress.progress_percentage}%` }}
                                  />
                                </div>
                                <span className="text-sm text-muted-foreground">
                                  {progress.progress_percentage}%
                                </span>
                              </div>
                            </div>
                            <Button size="sm" variant="ghost" asChild>
                              <Link to={`/course/${progress.course_id}`}>
                                <Play className="w-4 h-4" />
                              </Link>
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Play className="w-12 h-12 mx-auto mb-4 opacity-50" />
                        <p>Nenhum curso em progresso</p>
                        <Button className="mt-4" variant="outline" asChild>
                          <Link to="/courses">Explorar Cursos</Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Sugestões Personalizadas</CardTitle>
                    <CardDescription>
                      Cursos recomendados pela IA com base no seu perfil
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      <Star className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Função será implementada em breve</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="courses" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Meus Cursos</CardTitle>
                  <CardDescription>
                    Gerencie todos os seus cursos em um só lugar
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-semibold mb-2">Nenhum curso encontrado</h3>
                    <p className="mb-6">Você ainda não se inscreveu em nenhum curso</p>
                    <Button>Explorar Catálogo</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="profile" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Informações Pessoais</CardTitle>
                  <CardDescription>
                    Gerencie suas informações de perfil
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={user?.user_metadata?.avatar_url} />
                      <AvatarFallback className="text-lg">
                        {user?.user_metadata?.display_name 
                          ? getInitials(user.user_metadata.display_name)
                          : user?.email?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-semibold">
                        {user?.user_metadata?.display_name || 'Usuário'}
                      </h3>
                      <p className="text-muted-foreground">{user?.email}</p>
                      <Badge variant="secondary" className="mt-2">
                        Plano Gratuito
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Email</label>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Membro desde</label>
                      <p className="text-sm text-muted-foreground">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Editar Perfil
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}