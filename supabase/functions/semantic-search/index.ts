import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, userProfile } = await req.json();

    if (!query) {
      return new Response(JSON.stringify({ error: "Query is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get AI Gateway API key
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      console.error("LOVABLE_API_KEY not found");
      return new Response(JSON.stringify({ error: "AI service unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get all courses first
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*');

    if (coursesError) {
      console.error("Error fetching courses:", coursesError);
      return new Response(JSON.stringify({ error: "Failed to fetch courses" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use AI to analyze query and match with courses
    const contextPrompt = `
      Usuário pesquisou por: "${query}"
      
      ${userProfile ? `Perfil do usuário: ${JSON.stringify(userProfile)}` : ''}
      
      Cursos disponíveis:
      ${courses?.map(course => 
        `- ${course.title} (${course.category}, ${course.level}) - ${course.description}`
      ).join('\n')}
      
      Analise a pesquisa do usuário e retorne APENAS um array JSON com os IDs dos cursos mais relevantes, ordenados por relevância.
      Considere sinônimos, contexto e intenção da busca.
      
      Formato esperado: ["id1", "id2", "id3"]
      Máximo 8 resultados.
    `;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "Você é um sistema de busca semântica de cursos. Analise a intenção do usuário e retorne apenas um array JSON válido com IDs dos cursos mais relevantes.",
          },
          {
            role: "user",
            content: contextPrompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      console.error("AI Gateway error:", await response.text());
      // Fallback to simple search
      const filteredCourses = courses?.filter(course =>
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.description?.toLowerCase().includes(query.toLowerCase()) ||
        course.category?.toLowerCase().includes(query.toLowerCase())
      ) || [];
      
      return new Response(JSON.stringify({ 
        courses: filteredCourses.slice(0, 8),
        method: 'fallback'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content;

    if (!aiResponse) {
      console.error("No AI response");
      // Fallback to simple search
      const filteredCourses = courses?.filter(course =>
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.description?.toLowerCase().includes(query.toLowerCase()) ||
        course.category?.toLowerCase().includes(query.toLowerCase())
      ) || [];
      
      return new Response(JSON.stringify({ 
        courses: filteredCourses.slice(0, 8),
        method: 'fallback'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse AI response to get course IDs
    let relevantIds: string[] = [];
    try {
      const cleanResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      relevantIds = JSON.parse(cleanResponse);
    } catch (error) {
      console.error("Error parsing AI response:", error, "Response:", aiResponse);
      // Fallback to simple search
      const filteredCourses = courses?.filter(course =>
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.description?.toLowerCase().includes(query.toLowerCase()) ||
        course.category?.toLowerCase().includes(query.toLowerCase())
      ) || [];
      
      return new Response(JSON.stringify({ 
        courses: filteredCourses.slice(0, 8),
        method: 'fallback'
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Filter and order courses based on AI recommendations
    const relevantCourses = relevantIds
      .map(id => courses?.find(course => course.id === id))
      .filter(Boolean);

    return new Response(JSON.stringify({ 
      courses: relevantCourses,
      method: 'ai',
      total: relevantCourses.length
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in semantic search:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});