import { Button } from "@/components/ui/button";
import { 
  Play, 
  Clock, 
  Star, 
  Users, 
  BookOpen,
  ChevronRight 
} from "lucide-react";
import { FavoriteButton } from "./FavoriteButton";
import { useNavigate } from "react-router-dom";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    instructor: string;
    duration_minutes?: number;
    level: string;
    category: string;
    thumbnail_url?: string;
  };
  showFavoriteButton?: boolean;
}

const CourseCard = ({ course, showFavoriteButton = true }: CourseCardProps) => {
  const navigate = useNavigate();

  const formatDuration = (minutes?: number) => {
    if (!minutes) return "A definir";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h${mins > 0 ? ` ${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  const handleClick = () => {
    navigate(`/course/${course.id}`);
  };

  return (
    <div 
      className="course-card glass rounded-xl overflow-hidden border border-border/50 group cursor-pointer" 
      onClick={handleClick}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
        {course.thumbnail_url ? (
          <img 
            src={course.thumbnail_url} 
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
        )}
        
        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-smooth">
          <Button variant="hero" size="icon" className="w-16 h-16 rounded-full">
            <Play className="w-6 h-6" />
          </Button>
        </div>
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="glass px-3 py-1 rounded-full text-xs font-medium border border-border/50">
            {course.category}
          </span>
        </div>
        
        {/* Level Badge */}
        <div className="absolute top-4 right-4">
          <span className="bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-medium">
            {course.level}
          </span>
        </div>

        {/* Favorite Button */}
        {showFavoriteButton && (
          <div className="absolute top-4 right-16">
            <FavoriteButton courseId={course.id} />
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 group-hover:gradient-text transition-smooth line-clamp-2">
          {course.title}
        </h3>
        
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        
        <div className="text-sm text-muted-foreground mb-4">
          por <span className="text-foreground font-medium">{course.instructor}</span>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">{formatDuration(course.duration_minutes)}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Múltiplas aulas</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-muted-foreground">4.8</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">1.2k+</span>
          </div>
        </div>
        
        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-accent font-medium">Incluído na assinatura</div>
          
          <Button variant="ghost" size="sm" className="group/button">
            Ver Curso
            <ChevronRight className="w-4 h-4 ml-1 group-hover/button:translate-x-1 transition-smooth" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;