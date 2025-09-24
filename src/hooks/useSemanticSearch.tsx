import { useState } from 'react';
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
}

interface SearchResult {
  courses: Course[];
  method: 'ai' | 'fallback';
  total: number;
}

export const useSemanticSearch = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Course[]>([]);
  const { user } = useAuth();

  const search = async (query: string): Promise<Course[]> => {
    if (!query.trim()) {
      setResults([]);
      return [];
    }

    setLoading(true);
    try {
      // Get user profile for better recommendations
      let userProfile = null;
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        const { data: progress } = await supabase
          .from('course_progress')
          .select('*, courses(title, category)')
          .eq('user_id', user.id);

        userProfile = {
          profile,
          progress: progress || [],
          completedCourses: progress?.filter(p => p.is_completed) || [],
          preferences: progress?.map(p => p.courses?.category).filter(Boolean) || []
        };
      }

      const { data, error } = await supabase.functions.invoke('semantic-search', {
        body: { 
          query: query.trim(),
          userProfile 
        }
      });

      if (error) {
        console.error('Semantic search error:', error);
        // Fallback to regular search
        const { data: courses } = await supabase
          .from('courses')
          .select('*')
          .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
          .limit(8);
        
        setResults(courses || []);
        return courses || [];
      }

      const searchResult: SearchResult = data;
      setResults(searchResult.courses);
      return searchResult.courses;

    } catch (error) {
      console.error('Search error:', error);
      // Final fallback
      const { data: courses } = await supabase
        .from('courses')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(8);
      
      setResults(courses || []);
      return courses || [];
    } finally {
      setLoading(false);
    }
  };

  const getSuggestions = async (partialQuery: string): Promise<string[]> => {
    if (!partialQuery.trim() || partialQuery.length < 2) {
      return [];
    }

    try {
      const { data: courses } = await supabase
        .from('courses')
        .select('title, category')
        .or(`title.ilike.%${partialQuery}%,category.ilike.%${partialQuery}%`)
        .limit(5);

      const suggestions = new Set<string>();
      
      courses?.forEach(course => {
        if (course.title.toLowerCase().includes(partialQuery.toLowerCase())) {
          suggestions.add(course.title);
        }
        if (course.category?.toLowerCase().includes(partialQuery.toLowerCase())) {
          suggestions.add(course.category);
        }
      });

      return Array.from(suggestions).slice(0, 5);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  };

  return {
    search,
    getSuggestions,
    results,
    loading
  };
};