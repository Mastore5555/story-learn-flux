import { Button } from "@/components/ui/button";
import { 
  Play, 
  Clock, 
  Star, 
  Users, 
  BookOpen,
  ChevronRight 
} from "lucide-react";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    instructor: string;
    duration: string;
    level: string;
    rating: number;
    students: number;
    lessons: number;
    category: string;
    thumbnail: string;
    price?: string;
  };
}

const CourseCard = ({ course }: CourseCardProps) => {
  return (
    <div className="course-card glass rounded-xl overflow-hidden border border-border/50 group">
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10" />
        
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
            <span className="text-muted-foreground">{course.duration}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">{course.lessons} aulas</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-muted-foreground">{course.rating}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">{course.students}</span>
          </div>
        </div>
        
        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          {course.price ? (
            <div className="text-2xl font-bold text-primary">{course.price}</div>
          ) : (
            <div className="text-sm text-accent font-medium">Incluído na assinatura</div>
          )}
          
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