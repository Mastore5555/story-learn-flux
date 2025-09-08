import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration_minutes: number;
  thumbnail_url?: string;
  video_url?: string;
  category: string;
  level: string;
  is_premium: boolean;
  created_at: string;
  updated_at: string;
}

export interface CourseProgress {
  id: string;
  user_id: string;
  course_id: string;
  progress_percentage: number;
  completed_at?: string;
  last_watched_at: string;
  watch_time_minutes: number;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
  course?: Course;
}

export interface UserFavorite {
  id: string;
  user_id: string;
  course_id: string;
  created_at: string;
  course?: Course;
}

export const useProgress = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  // Get user progress stats
  const getUserStats = async () => {
    if (!user) return null;

    try {
      const [progressRes, favoritesRes] = await Promise.all([
        supabase
          .from('course_progress')
          .select('*, course:courses(*)')
          .eq('user_id', user.id),
        supabase
          .from('user_favorites')
          .select('*, course:courses(*)')
          .eq('user_id', user.id)
      ]);

      if (progressRes.error) throw progressRes.error;
      if (favoritesRes.error) throw favoritesRes.error;

      const progress = progressRes.data as CourseProgress[];
      const favorites = favoritesRes.data as UserFavorite[];
      
      const totalCourses = progress.length;
      const completedCourses = progress.filter(p => p.is_completed).length;
      const totalWatchTime = progress.reduce((sum, p) => sum + p.watch_time_minutes, 0);
      const activeCourses = progress.filter(p => !p.is_completed && p.progress_percentage > 0).length;

      return {
        totalCourses,
        activeCourses,
        completedCourses,
        totalWatchTime,
        favorites: favorites.length,
        recentProgress: progress
          .sort((a, b) => new Date(b.last_watched_at).getTime() - new Date(a.last_watched_at).getTime())
          .slice(0, 3),
        favoritesList: favorites.slice(0, 3)
      };
    } catch (error) {
      console.error('Error fetching user stats:', error);
      return null;
    }
  };

  // Update course progress
  const updateProgress = async (courseId: string, progressPercentage: number, watchTimeMinutes?: number) => {
    if (!user) return;

    setLoading(true);
    try {
      const isCompleted = progressPercentage >= 100;
      const updates = {
        user_id: user.id,
        course_id: courseId,
        progress_percentage: Math.min(progressPercentage, 100),
        last_watched_at: new Date().toISOString(),
        is_completed: isCompleted,
        ...(isCompleted && { completed_at: new Date().toISOString() }),
        ...(watchTimeMinutes && { watch_time_minutes: watchTimeMinutes })
      };

      const { error } = await supabase
        .from('course_progress')
        .upsert(updates, { onConflict: 'user_id,course_id' });

      if (error) throw error;

      if (isCompleted) {
        toast({
          title: "Parabéns! 🎉",
          description: "Você completou o curso!"
        });
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar o progresso",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Toggle favorite
  const toggleFavorite = async (courseId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const { data: existing } = await supabase
        .from('user_favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();

      if (existing) {
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('id', existing.id);
        
        if (error) throw error;
        
        toast({
          title: "Removido dos favoritos",
          description: "Curso removido da sua lista de favoritos"
        });
      } else {
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            course_id: courseId
          });
        
        if (error) throw error;
        
        toast({
          title: "Adicionado aos favoritos",
          description: "Curso salvo na sua lista de favoritos"
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar favoritos",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Start course (create initial progress)
  const startCourse = async (courseId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('course_progress')
        .upsert({
          user_id: user.id,
          course_id: courseId,
          progress_percentage: 0,
          last_watched_at: new Date().toISOString()
        }, { onConflict: 'user_id,course_id' });

      if (error) throw error;

      toast({
        title: "Curso iniciado!",
        description: "Bons estudos! Seu progresso será salvo automaticamente."
      });
    } catch (error) {
      console.error('Error starting course:', error);
      toast({
        title: "Erro",
        description: "Não foi possível iniciar o curso",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    getUserStats,
    updateProgress,
    toggleFavorite,
    startCourse,
    loading
  };
};