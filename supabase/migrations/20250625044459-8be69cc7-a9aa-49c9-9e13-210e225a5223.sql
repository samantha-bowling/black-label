
-- Add onboarding completion tracking to users table
ALTER TABLE public.users 
ADD COLUMN onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN skills TEXT[],
ADD COLUMN desired_gig_types TEXT[],
ADD COLUMN availability_status TEXT,
ADD COLUMN past_credits TEXT,
ADD COLUMN rate_range_min INTEGER,
ADD COLUMN rate_range_max INTEGER,
ADD COLUMN company_name TEXT,
ADD COLUMN typical_budget_min INTEGER,
ADD COLUMN typical_budget_max INTEGER,
ADD COLUMN timeline_expectations TEXT,
ADD COLUMN social_links JSONB DEFAULT '{}',
ADD COLUMN nda_required BOOLEAN DEFAULT FALSE;

-- Update the handle_new_user function to set default role properly
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'gig_seeker')
  );
  RETURN NEW;
END;
$$;
