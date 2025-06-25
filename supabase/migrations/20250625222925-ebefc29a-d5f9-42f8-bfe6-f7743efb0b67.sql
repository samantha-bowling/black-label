
-- First, let's fix the handle_new_user function to properly extract role and other data from signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role user_role;
  display_name_val text;
  invite_token_val uuid;
BEGIN
  -- Extract role from raw_user_meta_data, default to 'gig_seeker' if not provided
  user_role := COALESCE(
    (NEW.raw_user_meta_data->>'role')::user_role, 
    'gig_seeker'::user_role
  );
  
  -- Extract display name, fallback to email if not provided
  display_name_val := COALESCE(
    NEW.raw_user_meta_data->>'display_name', 
    NEW.email
  );
  
  -- Extract invite token if provided
  invite_token_val := CASE 
    WHEN NEW.raw_user_meta_data->>'invite_token' IS NOT NULL 
    THEN (NEW.raw_user_meta_data->>'invite_token')::uuid
    ELSE NULL
  END;

  -- Insert user profile with extracted data
  INSERT INTO public.users (
    id, 
    email, 
    display_name, 
    role,
    invite_token_used
  )
  VALUES (
    NEW.id,
    NEW.email,
    display_name_val,
    user_role,
    invite_token_val
  );
  
  -- Process invite token if provided
  IF invite_token_val IS NOT NULL THEN
    PERFORM public.use_invite_token(invite_token_val, NEW.id);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Ensure the trigger exists and is properly configured
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add a function to create missing user profiles for existing users
CREATE OR REPLACE FUNCTION public.ensure_user_profile(user_id_param uuid, email_param text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if profile already exists
  IF EXISTS (SELECT 1 FROM public.users WHERE id = user_id_param) THEN
    RETURN true;
  END IF;
  
  -- Create missing profile with default values
  INSERT INTO public.users (
    id, 
    email, 
    display_name, 
    role
  )
  VALUES (
    user_id_param,
    email_param,
    email_param, -- Use email as display name fallback
    'gig_seeker'::user_role -- Default role
  );
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RETURN false;
END;
$$;
