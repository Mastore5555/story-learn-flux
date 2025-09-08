-- Create courses table
CREATE TABLE public.courses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  instructor TEXT,
  duration_minutes INTEGER,
  thumbnail_url TEXT,
  video_url TEXT,
  category TEXT,
  level TEXT DEFAULT 'iniciante',
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create course progress table
CREATE TABLE public.course_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  completed_at TIMESTAMP WITH TIME ZONE,
  last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  watch_time_minutes INTEGER DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Create user favorites table
CREATE TABLE public.user_favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Courses policies (public read)
CREATE POLICY "Courses are viewable by everyone" 
ON public.courses 
FOR SELECT 
USING (true);

-- Course progress policies
CREATE POLICY "Users can view their own progress" 
ON public.course_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress" 
ON public.course_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress" 
ON public.course_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Favorites policies
CREATE POLICY "Users can view their own favorites" 
ON public.user_favorites 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" 
ON public.user_favorites 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
ON public.user_favorites 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add triggers for updated_at
CREATE TRIGGER update_courses_updated_at
BEFORE UPDATE ON public.courses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_course_progress_updated_at
BEFORE UPDATE ON public.course_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample courses
INSERT INTO public.courses (title, description, instructor, duration_minutes, category, level, thumbnail_url) VALUES
('Introdução ao React', 'Aprenda os fundamentos do React do zero', 'João Silva', 120, 'Programação', 'iniciante', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400'),
('Marketing Digital Avançado', 'Estratégias avançadas de marketing digital', 'Maria Santos', 180, 'Marketing', 'avançado', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400'),
('IA Generativa para Negócios', 'Como usar IA para impulsionar seus negócios', 'Pedro Costa', 150, 'Inteligência Artificial', 'intermediário', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400'),
('Automação com Python', 'Automatize tarefas repetitivas com Python', 'Ana Lima', 200, 'Programação', 'intermediário', 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400'),
('Design Thinking', 'Metodologia para inovação e criatividade', 'Carlos Oliveira', 90, 'Design', 'iniciante', 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400');

-- Enable realtime for progress tracking
ALTER TABLE public.course_progress REPLICA IDENTITY FULL;
ALTER TABLE public.user_favorites REPLICA IDENTITY FULL;