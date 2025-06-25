
-- Drop existing policy and create new one
DROP POLICY IF EXISTS "Users can set role only if NULL or admin" ON public.users;

-- 1. ROLE NULLABILITY: Update users.role to allow NULL and remove defaults
ALTER TABLE public.users ALTER COLUMN role DROP NOT NULL;
ALTER TABLE public.users ALTER COLUMN role DROP DEFAULT;

-- Update handle_new_user to not set role (leave as NULL)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email)
  );
  RETURN NEW;
END;
$$;

-- 2. RESTRICT ROLE CHANGES: Add helper function and RLS policies
CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT COALESCE((SELECT role = 'admin' FROM public.users WHERE id = auth.uid()), false);
$$;

-- Policy to allow role updates only if currently NULL or user is admin
CREATE POLICY "Users can set role only if NULL or admin" ON public.users
  FOR UPDATE 
  USING (
    auth.uid() = id AND (
      (SELECT role FROM public.users WHERE id = auth.uid()) IS NULL OR
      public.current_user_is_admin()
    )
  )
  WITH CHECK (
    auth.uid() = id AND (
      (SELECT role FROM public.users WHERE id = auth.uid()) IS NULL OR
      public.current_user_is_admin()
    )
  );
