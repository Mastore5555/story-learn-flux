import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface Course {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  level: string | null;
  duration_minutes: number | null;
  instructor: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
  is_premium: boolean | null;
  created_at: string;
  updated_at: string;
  reason?: string;
}

export const useGeminiSuggestions = () => {
  const [suggestions, setSuggestions] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const fetchSuggestions = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Get user profile and progress for better AI recommendations
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      const { data: progress } = await supabase
        .from('course_progress')
        .select('*, courses(title, category, level)')
        .eq('user_id', user.id);

      const { data: favorites } = await supabase
        .from('user_favorites')
        .select('courses(*)')
        .eq('user_id', user.id);

      // Get all available courses
      const { data: allCourses } = await supabase
        .from('courses')
        .select('*');

      const userContext = {
        profile,
        completedCourses: progress?.filter(p => p.is_completed).map(p => p.courses) || [],
        inProgressCourses: progress?.filter(p => !p.is_completed).map(p => p.courses) || [],
        favoriteCourses: favorites?.map(f => f.courses) || [],
        totalWatchTime: progress?.reduce((acc, p) => acc + (p.watch_time_minutes || 0), 0) || 0
      };

      const { data, error } = await supabase.functions.invoke('ai', {
        body: { 
          message: `
            Baseado no perfil do usuário, recomende 3-5 cursos mais adequados:
            
            Perfil: ${JSON.stringify(userContext)}
            
            Cursos disponíveis: ${JSON.stringify(allCourses)}
            
            Retorne apenas um JSON array com o formato:
            [
              {
                "id": "course_id",
                "reason": "Explicação breve (máx 50 chars)"
              }
            ]
          `
        }
      });

      if (error) {
        console.error('Error calling AI suggestions:', error);
        // Fallback to simple recommendations
        const fallbackSuggestions = allCourses?.slice(0, 3) || [];
        setSuggestions(fallbackSuggestions);
        return;
      }

      // Parse AI response and match with actual courses
      try {
        const aiResponse = data?.response || '';
        const cleanResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
        const recommendations = JSON.parse(cleanResponse);
        
        const enhancedSuggestions = recommendations
          .map((rec: any) => {
            const course = allCourses?.find(c => c.id === rec.id);
            return course ? { ...course, reason: rec.reason } : null;
          })
          .filter(Boolean);

        setSuggestions(enhancedSuggestions);
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        // Fallback to simple recommendations
        const fallbackSuggestions = allCourses?.slice(0, 3) || [];
        setSuggestions(fallbackSuggestions);
      }

    } catch (error) {
      console.error('Error fetching suggestions:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  const hasSuggestions = suggestions.length > 0;

  return {
    suggestions,
    loading,
    fetchSuggestions,
    hasSuggestions
  };
};