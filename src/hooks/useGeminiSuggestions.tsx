import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  thumbnail_url: string;
  category: string;
  duration_minutes: number;
  level: string;
  reason?: string;
}

export const useGeminiSuggestions = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchSuggestions = useCallback(async () => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Faça login para receber sugestões personalizadas",
      });
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('gemini-suggestions', {
        body: { user_id: user.id }
      });

      if (error) throw error;

      setSuggestions(data.suggestions || []);
      
      if (data.suggestions?.length > 0) {
        toast({
          title: "Sugestões atualizadas",
          description: "Encontramos novos cursos perfeitos para você!",
        });
      }
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as sugestões",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  return {
    suggestions,
    loading,
    fetchSuggestions,
    hasSuggestions: suggestions.length > 0
  };
};