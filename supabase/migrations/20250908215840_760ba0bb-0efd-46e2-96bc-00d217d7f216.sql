-- Create certificates table
CREATE TABLE public.certificates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  course_id UUID NOT NULL,
  certificate_number TEXT NOT NULL UNIQUE,
  issued_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own certificates" 
ON public.certificates 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own certificates" 
ON public.certificates 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add trigger for timestamps
CREATE TRIGGER update_certificates_updated_at
BEFORE UPDATE ON public.certificates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to generate certificate number
CREATE OR REPLACE FUNCTION public.generate_certificate_number()
RETURNS TEXT AS $$
DECLARE
    current_year TEXT := EXTRACT(YEAR FROM NOW())::TEXT;
    random_part TEXT := LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');
BEGIN
    RETURN 'SA-' || current_year || '-' || random_part;
END;
$$ LANGUAGE plpgsql;

-- Create function to auto-generate certificate when course is completed
CREATE OR REPLACE FUNCTION public.handle_course_completion()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if course is newly completed
  IF NEW.is_completed = TRUE AND (OLD.is_completed IS NULL OR OLD.is_completed = FALSE) THEN
    -- Create certificate if it doesn't exist
    INSERT INTO public.certificates (user_id, course_id, certificate_number)
    VALUES (NEW.user_id, NEW.course_id, public.generate_certificate_number())
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for auto certificate generation
CREATE TRIGGER on_course_completed
  AFTER UPDATE ON public.course_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_course_completion();