import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProgress, Course } from '@/hooks/useProgress';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Play, Clock, Star, Heart, Users } from 'lucide-react';

export default function Courses() {
  const { user } = useAuth();
  const { startCourse, toggleFavorite, loading } = useProgress();
  const [courses, setCourses] = useState<Course[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [progress, setProgress] = useState<Record<string, number>>({});
  const [loadingCourses, setLoadingCourses] = useState(true);

  useEffect(() => {
    loadCourses();
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Error loading courses:', error);
    } finally {
      setLoadingCourses(false);
    }
  };

  const loadUserData = async () => {
    if (!user) return;

    try {
      const [favoritesRes, progressRes] = await Promise.all([
        supabase
          .from('user_favorites')
          .select('course_id')
          .eq('user_id', user.id),
        supabase
          .from('course_progress')
          .select('course_id, progress_percentage')
          .eq('user_id', user.id)
      ]);

      if (favoritesRes.data) {
        setFavorites(favoritesRes.data.map(f => f.course_id));
      }

      if (progressRes.data) {
        const progressMap = progressRes.data.reduce((acc, p) => {
          acc[p.course_id] = p.progress_percentage;
          return acc;
        }, {} as Record<string, number>);
        setProgress(progressMap);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const handleStartCourse = async (courseId: string) => {
    await startCourse(courseId);
    await loadUserData(); // Refresh user data
  };

  const handleToggleFavorite = async (courseId: string) => {
    await toggleFavorite(courseId);
    await loadUserData(); // Refresh user data
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'iniciante': return 'bg-green-100 text-green-800';
      case 'intermediário': return 'bg-yellow-100 text-yellow-800';
      case 'avançado': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loadingCourses) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5">
        <div className="container py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Carregando cursos...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-primary mr-2" />
            <h1 className="text-4xl font-bold">Catálogo de Cursos</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubra nossa seleção de cursos profissionais e transforme sua carreira
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{courses.length}</p>
              <p className="text-sm text-muted-foreground">Cursos Disponíveis</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-accent" />
              <p className="text-2xl font-bold">
                {Math.floor(courses.reduce((sum, c) => sum + c.duration_minutes, 0) / 60)}h
              </p>
              <p className="text-sm text-muted-foreground">Total de Conteúdo</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold">{favorites.length}</p>
              <p className="text-sm text-muted-foreground">Seus Favoritos</p>
            </CardContent>
          </Card>
        </div>

        {/* Courses Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => {
            const courseProgress = progress[course.id] || 0;
            const isFavorite = favorites.includes(course.id);
            const hasStarted = courseProgress > 0;

            return (
              <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-video relative">
                  <img 
                    src={course.thumbnail_url || '/placeholder.svg'} 
                    alt={course.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      size="sm"
                      variant={isFavorite ? "default" : "outline"}
                      className="rounded-full w-8 h-8 p-0"
                      onClick={() => handleToggleFavorite(course.id)}
                      disabled={!user || loading}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                  {hasStarted && (
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="bg-background/90 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all" 
                          style={{ width: `${courseProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {course.instructor}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {course.description}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDuration(course.duration_minutes)}
                    </div>
                    <Badge className={getLevelColor(course.level)}>
                      {course.level}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{course.category}</Badge>
                    
                    {user ? (
                      <Button 
                        asChild
                        disabled={loading}
                        size="sm"
                      >
                        <Link to={`/course/${course.id}`}>
                          <Play className="w-4 h-4 mr-2" />
                          {hasStarted ? 'Continuar' : 'Assistir'}
                        </Link>
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" asChild>
                        <Link to="/auth">Fazer Login</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {courses.length === 0 && (
          <div className="text-center py-12">
            <Brain className="w-16 h-16 mx-auto mb-4 opacity-50 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">Nenhum curso encontrado</h3>
            <p className="text-muted-foreground">Novos cursos serão adicionados em breve!</p>
          </div>
        )}
      </div>
    </div>
  );
}