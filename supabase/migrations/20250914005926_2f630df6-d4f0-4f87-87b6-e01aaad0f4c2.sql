-- Fix the remaining function security warnings by adding search_path

-- Update generate_certificate_number function
CREATE OR REPLACE FUNCTION public.generate_certificate_number()
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
    current_year TEXT := EXTRACT(YEAR FROM NOW())::TEXT;
    random_part TEXT := LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');
BEGIN
    RETURN 'SA-' || current_year || '-' || random_part;
END;
$$;

-- Update handle_course_completion function
CREATE OR REPLACE FUNCTION public.handle_course_completion()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
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
$$;