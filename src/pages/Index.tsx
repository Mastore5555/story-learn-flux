import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProgress, Course, CourseProgress } from '@/hooks/useProgress';
import { supabase } from '@/integrations/supabase/client';
import HeroSection from "@/components/HeroSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Play, Clock, Star, BookOpen, TrendingUp, Users } from 'lucide-react';

const Index = () => {
  const { user } = useAuth();
  const { getUserStats } = useProgress();
  const [courses, setCourses] = useState<Course[]>([]);
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [userProgress, setUserProgress] = useState<CourseProgress[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load all courses
      const { data: allCourses } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });
      
      setCourses(allCourses || []);
      setFeaturedCourses((allCourses || []).slice(0, 3));

      // Load user data if logged in
      if (user) {
        const userStats = await getUserStats();
        setStats(userStats);
        setUserProgress(userStats?.recentProgress || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const categories = [
    { name: 'Programação', count: courses.filter(c => c.category === 'Programação').length, icon: '💻' },
    { name: 'Marketing', count: courses.filter(c => c.category === 'Marketing').length, icon: '📈' },
    { name: 'Inteligência Artificial', count: courses.filter(c => c.category === 'Inteligência Artificial').length, icon: '🤖' },
    { name: 'Design', count: courses.filter(c => c.category === 'Design').length, icon: '🎨' }
  ];

  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      
      {/* Continue Assistindo - Only for logged users with progress */}
      {user && userProgress.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Continue de onde parou</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Retome seus estudos e complete sua jornada de aprendizado
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {userProgress.slice(0, 3).map((progress) => (
                <Card key={progress.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="aspect-video relative">
                    <img 
                      src={progress.course?.thumbnail_url || '/placeholder.svg'} 
                      alt={progress.course?.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button asChild className="rounded-full">
                        <Link to={`/course/${progress.course_id}`}>
                          <Play className="w-5 h-5 mr-2" />
                          Continuar
                        </Link>
                      </Button>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="bg-background/90 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all" 
                          style={{ width: `${progress.progress_percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg leading-tight">{progress.course?.title}</CardTitle>
                    <CardDescription>{progress.course?.instructor}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{progress.progress_percentage}% concluído</span>
                      <span>{formatDuration(progress.watch_time_minutes)} assistidos</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-8">
              <Button variant="outline" asChild>
                <Link to="/dashboard">Ver Todos os Cursos</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Cursos em Destaque */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Cursos em Destaque</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Descubra os cursos mais populares e transforme sua carreira
            </p>
          </div>
          
          {loading ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-video bg-muted animate-pulse"></div>
                  <CardHeader>
                    <div className="h-4 bg-muted animate-pulse rounded mb-2"></div>
                    <div className="h-3 bg-muted animate-pulse rounded w-2/3"></div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
              {featuredCourses.map((course) => (
                <Card key={course.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                  <div className="aspect-video relative">
                    <img 
                      src={course.thumbnail_url || '/placeholder.svg'} 
                      alt={course.title}
                      className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button asChild>
                        <Link to={user ? `/course/${course.id}` : '/auth'}>
                          <Play className="w-5 h-5 mr-2" />
                          {user ? 'Assistir' : 'Fazer Login'}
                        </Link>
                      </Button>
                    </div>
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
                        <CardDescription className="mt-1">{course.instructor}</CardDescription>
                      </div>
                      <Badge variant="secondary">{course.level}</Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {course.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatDuration(course.duration_minutes)}
                      </div>
                      <Badge variant="outline">{course.category}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Button asChild>
              <Link to="/courses">Ver Todos os Cursos</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categorias */}
      <section className="py-20 bg-gradient-to-br from-accent/5 via-background to-primary/5" id="categorias">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Explore por Categoria</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Encontre exatamente o que você precisa para acelerar sua carreira
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-4xl mx-auto">
            {categories.map((category) => (
              <Card key={category.name} className="text-center hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-8">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {category.count} {category.count === 1 ? 'curso' : 'cursos'}
                  </p>
                  <Button variant="ghost" className="mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                    <Link to="/courses">Explorar</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-background" id="sobre">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Por que escolher a Techflix Academy?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Uma plataforma completa para sua evolução profissional
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-3 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">{courses.length}+</div>
              <p className="text-muted-foreground">Cursos Disponíveis</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">
                {Math.floor(courses.reduce((sum, c) => sum + c.duration_minutes, 0) / 60)}h+
              </div>
              <p className="text-muted-foreground">Horas de Conteúdo</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <p className="text-muted-foreground">Gratuito</p>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">
              Blog da <span className="text-primary">Techflix</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Artigos, tutoriais e insights sobre tecnologia e desenvolvimento profissional
            </p>
          </div>
          
          <div className="flex justify-center">
            <Link to="/blog">
              <Button size="lg" className="bg-gradient-to-r from-primary to-accent hover:scale-105 transition-smooth">
                Visitar Blog
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
      <Footer />
    </div>
  );
};

export default Index;