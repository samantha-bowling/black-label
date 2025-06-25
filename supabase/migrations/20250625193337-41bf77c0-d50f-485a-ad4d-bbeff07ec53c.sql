
-- Add email column to the public.users table
ALTER TABLE public.users 
ADD COLUMN email TEXT;

-- Create a unique index on email for data integrity
CREATE UNIQUE INDEX idx_users_email ON public.users(email);

-- Update the handle_new_user function to include email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, display_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    NEW.email
  );
  RETURN NEW;
END;
$$;
