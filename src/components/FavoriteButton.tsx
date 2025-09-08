import { Heart } from 'lucide-react';
import { Button } from './ui/button';
import { useFavorites } from '@/hooks/useFavorites';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  courseId: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export const FavoriteButton = ({ courseId, className, size = 'sm' }: FavoriteButtonProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(courseId);

  return (
    <Button
      variant="ghost"
      size={size}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(courseId);
      }}
      className={cn(
        "p-2 hover:bg-background/80 transition-colors",
        className
      )}
    >
      <Heart 
        className={cn(
          "h-4 w-4 transition-colors",
          favorite ? "fill-red-500 text-red-500" : "text-muted-foreground hover:text-red-500"
        )} 
      />
    </Button>
  );
};