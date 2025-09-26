import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import { Achievement } from '@/components/analytics/AchievementBadge';

export interface AnalyticsData {
  weeklyProgress: { name: string; progress: number; time: number }[];
  categoryBreakdown: { name: string; value: number }[];
  studyStreak: number;
  totalMinutes: number;
  achievements: Achievement[];
  insights: string[];
}

export const useAnalytics = () => {
  const { user } = useAuth();
  const { getUserStats } = useProgress();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);

  // Mock data generator for demo purposes
  const generateMockAnalytics = async (): Promise<AnalyticsData> => {
    const stats = await getUserStats();
    
    // Weekly progress data
    const weeklyProgress = [
      { name: 'Seg', progress: 15, time: 45 },
      { name: 'Ter', progress: 25, time: 60 },
      { name: 'Qua', progress: 20, time: 30 },
      { name: 'Qui', progress: 35, time: 90 },
      { name: 'Sex', progress: 40, time: 75 },
      { name: 'Sáb', progress: 30, time: 50 },
      { name: 'Dom', progress: 20, time: 40 },
    ];

    // Category breakdown
    const categoryBreakdown = [
      { name: 'Programação', value: 40 },
      { name: 'Design', value: 25 },
      { name: 'Marketing', value: 20 },
      { name: 'Business', value: 15 },
    ];

    // Achievements system
    const achievements: Achievement[] = [
      {
        id: '1',
        title: 'Primeiro Passo',
        description: 'Complete seu primeiro curso',
        icon: 'star',
        unlocked: (stats?.completedCourses || 0) > 0,
        rarity: 'common',
      },
      {
        id: '2',
        title: 'Estudante Dedicado',
        description: 'Estude por 10 horas',
        icon: 'clock',
        unlocked: (stats?.totalWatchTime || 0) >= 600,
        progress: Math.min(stats?.totalWatchTime || 0, 600),
        maxProgress: 600,
        rarity: 'rare',
      },
      {
        id: '3',
        title: 'Colecionador',
        description: 'Adicione 5 cursos aos favoritos',
        icon: 'trophy',
        unlocked: (stats?.favorites || 0) >= 5,
        progress: Math.min(stats?.favorites || 0, 5),
        maxProgress: 5,
        rarity: 'epic',
      },
      {
        id: '4',
        title: 'Mestre',
        description: 'Complete 10 cursos',
        icon: 'crown',
        unlocked: (stats?.completedCourses || 0) >= 10,
        progress: Math.min(stats?.completedCourses || 0, 10),
        maxProgress: 10,
        rarity: 'legendary',
      },
      {
        id: '5',
        title: 'Explorador',
        description: 'Inicie 3 cursos diferentes',
        icon: 'book',
        unlocked: (stats?.totalCourses || 0) >= 3,
        progress: Math.min(stats?.totalCourses || 0, 3),
        maxProgress: 3,
        rarity: 'common',
      },
      {
        id: '6',
        title: 'Velocista',
        description: 'Complete um curso em 1 dia',
        icon: 'zap',
        unlocked: false,
        rarity: 'epic',
      },
    ];

    // AI-generated insights
    const insights = [
      `Você estudou ${Math.floor((stats?.totalWatchTime || 0) / 60)}h esta semana. Continue assim!`,
      'Seus melhores dias de estudo são quinta e sexta-feira.',
      'Você tem preferência por cursos de programação e design.',
      `${achievements.filter(a => a.unlocked).length} conquistas desbloqueadas de ${achievements.length} total.`,
    ];

    return {
      weeklyProgress,
      categoryBreakdown,
      studyStreak: 5,
      totalMinutes: stats?.totalWatchTime || 0,
      achievements,
      insights,
    };
  };

  const loadAnalytics = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const data = await generateMockAnalytics();
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, [user]);

  return {
    analytics,
    loading,
    refetch: loadAnalytics,
  };
};