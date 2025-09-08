import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  category: string;
  level: string;
  duration_minutes: number;
  thumbnail_url: string;
  is_premium: boolean;
  created_at: string;
}

export interface SearchFilters {
  category?: string;
  level?: string;
  duration?: string;
  instructor?: string;
}

export const useSearch = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({});

  const searchCourses = async (query: string, searchFilters: SearchFilters = {}) => {
    setLoading(true);
    
    try {
      let queryBuilder = supabase
        .from('courses')
        .select('*');

      // Busca por texto
      if (query.trim()) {
        queryBuilder = queryBuilder.or(
          `title.ilike.%${query}%,description.ilike.%${query}%,instructor.ilike.%${query}%`
        );
      }

      // Filtros
      if (searchFilters.category) {
        queryBuilder = queryBuilder.eq('category', searchFilters.category);
      }
      
      if (searchFilters.level) {
        queryBuilder = queryBuilder.eq('level', searchFilters.level);
      }

      if (searchFilters.instructor) {
        queryBuilder = queryBuilder.eq('instructor', searchFilters.instructor);
      }

      // Filtro de duração
      if (searchFilters.duration) {
        switch (searchFilters.duration) {
          case 'short':
            queryBuilder = queryBuilder.lte('duration_minutes', 60);
            break;
          case 'medium':
            queryBuilder = queryBuilder.gte('duration_minutes', 61).lte('duration_minutes', 180);
            break;
          case 'long':
            queryBuilder = queryBuilder.gte('duration_minutes', 181);
            break;
        }
      }

      queryBuilder = queryBuilder.order('created_at', { ascending: false });

      const { data, error } = await queryBuilder;

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Erro na busca:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const getAllCourses = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const updateFilters = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    searchCourses(searchQuery, newFilters);
  };

  const updateSearch = (query: string) => {
    setSearchQuery(query);
    searchCourses(query, filters);
  };

  // Busca inicial
  useEffect(() => {
    getAllCourses();
  }, []);

  return {
    courses,
    loading,
    searchQuery,
    filters,
    searchCourses,
    updateFilters,
    updateSearch,
    getAllCourses
  };
};