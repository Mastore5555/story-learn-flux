import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CourseProgress } from '@/hooks/useProgress';
import { Play, Clock, CheckCircle } from 'lucide-react';

interface ProgressCardProps {
  progress: CourseProgress;
  onContinue?: () => void;
}

export const ProgressCard = ({ progress, onContinue }: ProgressCardProps) => {
  const course = progress.course;
  if (!course) return null;

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const formatWatchTime = (watchedMinutes: number, totalMinutes: number) => {
    return `${formatDuration(watchedMinutes)} / ${formatDuration(totalMinutes)}`;
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="aspect-video relative overflow-hidden rounded-t-lg">
        <img 
          src={course.thumbnail_url || '/placeholder.svg'} 
          alt={course.title}
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <Button 
            size="lg"
            className="rounded-full"
            onClick={onContinue}
          >
            <Play className="w-5 h-5 mr-2" />
            {progress.progress_percentage === 0 ? 'Iniciar' : 'Continuar'}
          </Button>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg leading-tight">{course.title}</CardTitle>
            <CardDescription className="mt-1">
              {course.instructor} • {course.category}
            </CardDescription>
          </div>
          <Badge variant={progress.is_completed ? "default" : "secondary"}>
            {progress.is_completed ? <CheckCircle className="w-3 h-3 mr-1" /> : null}
            {progress.is_completed ? 'Concluído' : `${progress.progress_percentage}%`}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Progresso</span>
              <span>{progress.progress_percentage}%</span>
            </div>
            <Progress value={progress.progress_percentage} className="h-2" />
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-1" />
              {formatWatchTime(progress.watch_time_minutes, course.duration_minutes)}
            </div>
            <Badge variant="outline" className="text-xs">
              {course.level}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};