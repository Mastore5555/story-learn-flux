-- Create blog tables for Techflix Academy
-- This will support blog posts, categories, and tags

-- Create blog categories table
CREATE TABLE public.blog_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  category_id UUID REFERENCES public.blog_categories(id),
  author_id UUID REFERENCES public.profiles(user_id),
  published BOOLEAN NOT NULL DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  views_count INTEGER NOT NULL DEFAULT 0,
  reading_time INTEGER, -- in minutes
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create blog tags table
CREATE TABLE public.blog_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create junction table for post tags (many-to-many)
CREATE TABLE public.blog_post_tags (
  post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- Enable RLS on all blog tables
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;

-- Create policies for blog categories (public read)
CREATE POLICY "Blog categories are viewable by everyone" 
ON public.blog_categories 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can manage categories" 
ON public.blog_categories 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create policies for blog posts
CREATE POLICY "Published blog posts are viewable by everyone" 
ON public.blog_posts 
FOR SELECT 
USING (published = true OR auth.uid() = author_id);

CREATE POLICY "Users can create their own blog posts" 
ON public.blog_posts 
FOR INSERT 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own blog posts" 
ON public.blog_posts 
FOR UPDATE 
USING (auth.uid() = author_id);

CREATE POLICY "Users can delete their own blog posts" 
ON public.blog_posts 
FOR DELETE 
USING (auth.uid() = author_id);

-- Create policies for blog tags (public read)
CREATE POLICY "Blog tags are viewable by everyone" 
ON public.blog_tags 
FOR SELECT 
USING (true);

CREATE POLICY "Only authenticated users can manage tags" 
ON public.blog_tags 
FOR ALL 
USING (auth.uid() IS NOT NULL);

-- Create policies for blog post tags junction table
CREATE POLICY "Blog post tags are viewable by everyone" 
ON public.blog_post_tags 
FOR SELECT 
USING (true);

CREATE POLICY "Only post authors can manage post tags" 
ON public.blog_post_tags 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.blog_posts 
    WHERE id = post_id AND author_id = auth.uid()
  )
);

-- Create function to update blog post updated_at
CREATE TRIGGER update_blog_categories_updated_at
BEFORE UPDATE ON public.blog_categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update views count
CREATE OR REPLACE FUNCTION public.increment_blog_post_views(post_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.blog_posts 
  SET views_count = views_count + 1 
  WHERE id = post_id AND published = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create indexes for better performance
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published, published_at DESC);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category_id);
CREATE INDEX idx_blog_posts_author ON public.blog_posts(author_id);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_categories_slug ON public.blog_categories(slug);
CREATE INDEX idx_blog_tags_slug ON public.blog_tags(slug);

-- Insert some sample categories
INSERT INTO public.blog_categories (name, slug, description) VALUES
('Tecnologia', 'tecnologia', 'Artigos sobre as últimas tendências em tecnologia'),
('Programação', 'programacao', 'Tutoriais e dicas de programação'),
('Carreira', 'carreira', 'Dicas para desenvolvimento profissional'),
('IA & Machine Learning', 'ia-machine-learning', 'Inteligência Artificial e Machine Learning'),
('Web Development', 'web-development', 'Desenvolvimento web moderno');

-- Insert some sample tags
INSERT INTO public.blog_tags (name, slug) VALUES
('React', 'react'),
('JavaScript', 'javascript'),
('Python', 'python'),
('Tutorial', 'tutorial'),
('Iniciante', 'iniciante'),
('Avançado', 'avancado'),
('Frontend', 'frontend'),
('Backend', 'backend'),
('AI', 'ai'),
('Career Tips', 'career-tips');