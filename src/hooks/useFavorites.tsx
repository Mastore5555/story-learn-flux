import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Favorite {
  id: string;
  course_id: string;
  created_at: string;
  courses: {
    id: string;
    title: string;
    description: string;
    instructor: string;
    thumbnail_url: string;
    category: string;
    duration_minutes: number;
    level: string;
  };
}

export const useFavorites = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    if (!user) {
      setFavorites([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select(`
          id,
          course_id,
          created_at,
          courses:course_id (
            id,
            title,
            description,
            instructor,
            thumbnail_url,
            category,
            duration_minutes,
            level
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error('Erro ao buscar favoritos:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os favoritos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const isFavorite = (courseId: string) => {
    return favorites.some(fav => fav.course_id === courseId);
  };

  const toggleFavorite = async (courseId: string) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para favoritar cursos",
      });
      return;
    }

    const isCurrentlyFavorite = isFavorite(courseId);

    try {
      if (isCurrentlyFavorite) {
        // Remove dos favoritos
        const { error } = await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('course_id', courseId);

        if (error) throw error;

        setFavorites(prev => prev.filter(fav => fav.course_id !== courseId));
        toast({
          title: "Removido dos favoritos",
          description: "Curso removido da sua lista de favoritos",
        });
      } else {
        // Adiciona aos favoritos
        const { error } = await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            course_id: courseId
          });

        if (error) throw error;

        // Busca os dados do curso para atualizar a lista
        const { data: courseData } = await supabase
          .from('courses')
          .select('*')
          .eq('id', courseId)
          .single();

        if (courseData) {
          const newFavorite: Favorite = {
            id: crypto.randomUUID(),
            course_id: courseId,
            created_at: new Date().toISOString(),
            courses: courseData
          };
          setFavorites(prev => [newFavorite, ...prev]);
        }

        toast({
          title: "Adicionado aos favoritos",
          description: "Curso salvo na sua lista de favoritos",
        });
      }
    } catch (error) {
      console.error('Erro ao atualizar favorito:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar os favoritos",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  return {
    favorites,
    loading,
    isFavorite,
    toggleFavorite,
    refetch: fetchFavorites
  };
};