import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProgress, Course } from '@/hooks/useProgress';
import { supabase } from '@/integrations/supabase/client';
import { VideoPlayer } from '@/components/VideoPlayer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, Clock, Users, Star, Heart, CheckCircle, Play } from 'lucide-react';

export default function CoursePlayer() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const { updateProgress, toggleFavorite, loading } = useProgress();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [courseProgress, setCourseProgress] = useState<number>(0);
  const [watchTime, setWatchTime] = useState<number>(0);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [relatedCourses, setRelatedCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (courseId) {
      loadCourse();
      if (user) {
        loadUserProgress();
      }
    }
  }, [courseId, user]);

  const loadCourse = async () => {
    if (!courseId) return;

    try {
      const { data: courseData, error } = await supabase
        .from('courses')
        .select('*')
        .eq('id', courseId)
        .single();

      if (error) throw error;
      setCourse(courseData);

      // Load related courses
      const { data: related } = await supabase
        .from('courses')
        .select('*')
        .eq('category', courseData.category)
        .neq('id', courseId)
        .limit(3);

      setRelatedCourses(related || []);
    } catch (error) {
      console.error('Error loading course:', error);
    } finally {
      setLoadingCourse(false);
    }
  };

  const loadUserProgress = async () => {
    if (!courseId || !user) return;

    try {
      const [progressRes, favoriteRes] = await Promise.all([
        supabase
          .from('course_progress')
          .select('progress_percentage, watch_time_minutes')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .maybeSingle(),
        supabase
          .from('user_favorites')
          .select('id')
          .eq('user_id', user.id)
          .eq('course_id', courseId)
          .maybeSingle()
      ]);

      if (progressRes.data) {
        setCourseProgress(progressRes.data.progress_percentage);
        setWatchTime(progressRes.data.watch_time_minutes);
      }

      setIsFavorite(!!favoriteRes.data);
    } catch (error) {
      console.error('Error loading user progress:', error);
    }
  };

  const handleProgress = async (currentTime: number, duration: number, percentage: number) => {
    if (!courseId || !user) return;

    const watchTimeMinutes = Math.floor(currentTime / 60);
    
    // Update local state immediately
    setCourseProgress(percentage);
    setWatchTime(watchTimeMinutes);

    // Debounce database updates (only update every 30 seconds of video time)
    if (Math.floor(currentTime) % 30 === 0) {
      await updateProgress(courseId, percentage, watchTimeMinutes);
    }
  };

  const handleToggleFavorite = async () => {
    if (!courseId) return;
    
    await toggleFavorite(courseId);
    setIsFavorite(!isFavorite);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  if (loadingCourse) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando curso...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Curso não encontrado</h2>
          <p className="text-muted-foreground mb-4">O curso que você procura não existe.</p>
          <Button asChild>
            <Link to="/courses">Voltar aos Cursos</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-4">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/courses">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar aos Cursos
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-xl font-semibold truncate">{course.title}</h1>
              <p className="text-sm text-muted-foreground">{course.instructor}</p>
            </div>
            {user && (
              <Button
                variant={isFavorite ? "default" : "outline"}
                size="sm"
                onClick={handleToggleFavorite}
                disabled={loading}
              >
                <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
                {isFavorite ? 'Favoritado' : 'Favoritar'}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container py-6">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Video Player */}
          <div className="lg:col-span-2 space-y-6">
            <div className="aspect-video">
              <VideoPlayer
                src={course.video_url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"}
                title={course.title}
                onProgress={handleProgress}
                className="w-full h-full"
              />
            </div>

            {/* Course Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-2xl">{course.title}</CardTitle>
                    <CardDescription className="text-base mt-2">
                      {course.description}
                    </CardDescription>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>
                        {course.instructor.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{course.instructor}</p>
                      <p className="text-sm text-muted-foreground">Instrutor</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDuration(course.duration_minutes)}
                    </div>
                    <Badge variant="outline">{course.level}</Badge>
                    <Badge variant="secondary">{course.category}</Badge>
                  </div>
                </div>
              </CardHeader>

              {user && (
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Seu Progresso</span>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(courseProgress)}%
                      </span>
                    </div>
                    <Progress value={courseProgress} className="h-3" />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Tempo assistido: {formatDuration(watchTime)}</span>
                      {courseProgress >= 100 && (
                        <div className="flex items-center text-green-600">
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Concluído
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Detalhes do Curso</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Duração</span>
                  <span className="text-sm font-medium">{formatDuration(course.duration_minutes)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Nível</span>
                  <Badge variant="outline">{course.level}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Categoria</span>
                  <span className="text-sm font-medium">{course.category}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Instrutor</span>
                  <span className="text-sm font-medium">{course.instructor}</span>
                </div>
              </CardContent>
            </Card>

            {/* Related Courses */}
            {relatedCourses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cursos Relacionados</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {relatedCourses.map((relatedCourse) => (
                    <div key={relatedCourse.id} className="flex space-x-3">
                      <img
                        src={relatedCourse.thumbnail_url || '/placeholder.svg'}
                        alt={relatedCourse.title}
                        className="w-16 h-12 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm leading-tight truncate">
                          {relatedCourse.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {relatedCourse.instructor}
                        </p>
                        <div className="flex items-center mt-1">
                          <Clock className="w-3 h-3 mr-1 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {formatDuration(relatedCourse.duration_minutes)}
                          </span>
                        </div>
                      </div>
                      <Button size="sm" variant="ghost" asChild>
                        <Link to={`/course/${relatedCourse.id}`}>
                          <Play className="w-3 h-3" />
                        </Link>
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}