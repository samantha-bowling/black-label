
-- Create invites table to track invitation tokens and usage
CREATE TABLE public.invites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  created_by_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  used_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  email TEXT, -- Optional: pre-assign invite to specific email
  used_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '30 days'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add invite tracking to users table
ALTER TABLE public.users 
ADD COLUMN invites_remaining INTEGER NOT NULL DEFAULT 3,
ADD COLUMN invited_by_user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
ADD COLUMN invite_token_used UUID REFERENCES public.invites(token) ON DELETE SET NULL;

-- Enable RLS on invites table
ALTER TABLE public.invites ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view invites they created
CREATE POLICY "Users can view their own invites" 
  ON public.invites 
  FOR SELECT 
  USING (auth.uid() = created_by_user_id);

-- Policy: Users can create invites if they have remaining invites or are admin
CREATE POLICY "Users can create invites if they have remaining or are admin" 
  ON public.invites 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = created_by_user_id AND (
      (SELECT invites_remaining FROM public.users WHERE id = auth.uid()) > 0 OR
      public.current_user_is_admin()
    )
  );

-- Policy: Allow reading invite tokens for redemption (public access needed for signup)
CREATE POLICY "Anyone can read invite tokens for redemption" 
  ON public.invites 
  FOR SELECT 
  USING (used_by_user_id IS NULL AND expires_at > now());

-- Update invites remaining when user creates an invite (trigger)
CREATE OR REPLACE FUNCTION public.decrement_invites_remaining()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only decrement for non-admin users
  IF NOT public.current_user_is_admin() THEN
    UPDATE public.users 
    SET invites_remaining = invites_remaining - 1 
    WHERE id = NEW.created_by_user_id;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_invite_created
  AFTER INSERT ON public.invites
  FOR EACH ROW EXECUTE FUNCTION public.decrement_invites_remaining();

-- Function to validate and use invite token
CREATE OR REPLACE FUNCTION public.use_invite_token(token_param UUID, user_id_param UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  invite_record RECORD;
BEGIN
  -- Find valid invite
  SELECT * INTO invite_record
  FROM public.invites 
  WHERE token = token_param 
    AND used_by_user_id IS NULL 
    AND expires_at > now();
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Mark invite as used
  UPDATE public.invites 
  SET used_by_user_id = user_id_param, used_at = now()
  WHERE token = token_param;
  
  -- Update user with invite info
  UPDATE public.users 
  SET invited_by_user_id = invite_record.created_by_user_id,
      invite_token_used = token_param
  WHERE id = user_id_param;
  
  RETURN TRUE;
END;
$$;
