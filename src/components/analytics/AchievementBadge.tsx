import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Trophy, Star, BookOpen, Clock, Award, Target, Zap, Crown } from 'lucide-react';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'sm' | 'md' | 'lg';
}

const iconMap = {
  trophy: Trophy,
  star: Star,
  book: BookOpen,
  clock: Clock,
  award: Award,
  target: Target,
  zap: Zap,
  crown: Crown,
};

const rarityStyles = {
  common: {
    background: 'bg-muted',
    text: 'text-muted-foreground',
    glow: '',
  },
  rare: {
    background: 'bg-primary/20',
    text: 'text-primary',
    glow: 'shadow-[0_0_20px_hsl(var(--primary)/0.3)]',
  },
  epic: {
    background: 'bg-accent/20',
    text: 'text-accent',
    glow: 'shadow-[0_0_20px_hsl(var(--accent)/0.3)]',
  },
  legendary: {
    background: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20',
    text: 'text-yellow-500',
    glow: 'shadow-[0_0_30px_rgba(255,215,0,0.4)]',
  },
};

export function AchievementBadge({ achievement, size = 'md' }: AchievementBadgeProps) {
  const IconComponent = iconMap[achievement.icon as keyof typeof iconMap] || Award;
  const rarity = rarityStyles[achievement.rarity];
  
  const sizeClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  const iconSizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
  };

  return (
    <Card className={`relative transition-all duration-300 ${achievement.unlocked ? rarity.glow : 'opacity-60'} ${sizeClasses[size]}`}>
      <CardContent className={`p-0 text-center ${rarity.background} rounded-lg border`}>
        <div className="space-y-2">
          <div className={`mx-auto ${iconSizes[size]} ${rarity.text} ${achievement.unlocked ? '' : 'opacity-50'}`}>
            <IconComponent className="w-full h-full" />
          </div>
          
          <div>
            <h4 className={`font-semibold text-sm ${achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
              {achievement.title}
            </h4>
            <p className={`text-xs ${achievement.unlocked ? 'text-muted-foreground' : 'text-muted-foreground/60'}`}>
              {achievement.description}
            </p>
          </div>

          {achievement.progress !== undefined && achievement.maxProgress && (
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{achievement.progress}</span>
                <span>{achievement.maxProgress}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-1.5">
                <div 
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    achievement.unlocked ? 'bg-primary' : 'bg-muted-foreground/30'
                  }`}
                  style={{ width: `${Math.min((achievement.progress / achievement.maxProgress) * 100, 100)}%` }}
                />
              </div>
            </div>
          )}

          <Badge 
            variant={achievement.unlocked ? "default" : "secondary"}
            className={`text-xs ${rarity.text}`}
          >
            {achievement.rarity.toUpperCase()}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}