
-- Fix RLS policies for invites table to allow public validation during signup
DROP POLICY IF EXISTS "Anyone can read invite tokens for redemption" ON public.invites;

-- Create a more permissive policy for invite validation that works for unauthenticated users
CREATE POLICY "Public can validate unused invite tokens" 
  ON public.invites 
  FOR SELECT 
  USING (
    used_by_user_id IS NULL AND 
    expires_at > now()
  );

-- Ensure the policy allows reading all necessary fields for validation
CREATE POLICY "Public can read invite details for validation" 
  ON public.invites 
  FOR SELECT 
  USING (true);
