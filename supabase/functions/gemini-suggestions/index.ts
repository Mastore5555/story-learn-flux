import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!GEMINI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Missing required environment variables');
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { user_id } = await req.json();

    if (!user_id) {
      throw new Error('User ID is required');
    }

    // Get user's course progress and favorites
    const [progressData, favoritesData, coursesData] = await Promise.all([
      supabase
        .from('course_progress')
        .select('course_id, progress_percentage, is_completed')
        .eq('user_id', user_id),
      
      supabase
        .from('user_favorites')
        .select('course_id')
        .eq('user_id', user_id),
      
      supabase
        .from('courses')
        .select('id, title, category, level, description')
    ]);

    const userProgress = progressData.data || [];
    const userFavorites = favoritesData.data || [];
    const allCourses = coursesData.data || [];

    // Build user profile for AI analysis
    const completedCourses = userProgress.filter(p => p.is_completed);
    const inProgressCourses = userProgress.filter(p => !p.is_completed && p.progress_percentage > 0);
    const favoriteCategories = userFavorites.map(f => {
      const course = allCourses.find(c => c.id === f.course_id);
      return course?.category;
    }).filter(Boolean);

    const userProfile = {
      completedCourses: completedCourses.length,
      inProgressCourses: inProgressCourses.length,
      favoriteCategories,
      preferredLevel: completedCourses.length > 3 ? 'intermediário' : 'iniciante'
    };

    // Create prompt for Gemini
    const prompt = `
Você é um assistente especializado em recomendar cursos online. Baseado no perfil do usuário, sugira 4 cursos específicos da lista disponível.

Perfil do usuário:
- Cursos concluídos: ${userProfile.completedCourses}
- Cursos em progresso: ${userProfile.inProgressCourses}
- Categorias favoritas: ${favoriteCategories.join(', ') || 'Nenhuma ainda'}
- Nível preferido: ${userProfile.preferredLevel}

Cursos disponíveis:
${allCourses.map(course => `- ${course.title} (${course.category}, ${course.level}): ${course.description}`).join('\n')}

Responda APENAS com um JSON no formato:
{
  "suggestions": [
    {
      "course_id": "id_do_curso",
      "reason": "Motivo da recomendação (máximo 50 caracteres)"
    }
  ]
}

Escolha 4 cursos que façam sentido para o perfil do usuário. Se o usuário for iniciante, priorize cursos básicos. Se já tem experiência, sugira cursos mais avançados.
`;

    // Call Gemini API
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500
          }
        })
      }
    );

    const geminiData = await geminiResponse.json();
    
    if (!geminiData.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid Gemini API response');
    }

    let suggestions;
    try {
      const responseText = geminiData.candidates[0].content.parts[0].text;
      console.log('Gemini response:', responseText);
      
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      
      suggestions = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      
      // Fallback: return random suggestions
      const shuffled = allCourses.sort(() => 0.5 - Math.random());
      suggestions = {
        suggestions: shuffled.slice(0, 4).map(course => ({
          course_id: course.id,
          reason: "Recomendado para você"
        }))
      };
    }

    // Get full course details for suggestions
    const suggestedCourseIds = suggestions.suggestions.map((s: any) => s.course_id);
    const { data: suggestedCourses } = await supabase
      .from('courses')
      .select('*')
      .in('id', suggestedCourseIds);

    // Combine suggestions with course details
    const finalSuggestions = suggestions.suggestions.map((suggestion: any) => {
      const course = suggestedCourses?.find(c => c.id === suggestion.course_id);
      return {
        ...course,
        reason: suggestion.reason
      };
    }).filter(Boolean);

    return new Response(
      JSON.stringify({ suggestions: finalSuggestions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in gemini-suggestions function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});