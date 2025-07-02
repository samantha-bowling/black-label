-- Fix 1: Consolidate and secure invites RLS policies
-- Remove overly permissive policies and implement stricter controls

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Public can read invite details for validation" ON public.invites;
DROP POLICY IF EXISTS "Public can validate unused invite tokens" ON public.invites;

-- Keep the more restrictive policy that checks for non-suspended creators
-- This policy already exists: "Public invite validation"

-- Fix 2: Add rate limiting for invite validation operations
-- Create function to check invite validation rate limits
CREATE OR REPLACE FUNCTION public.check_invite_validation_rate_limit(p_identifier text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Allow max 10 invite validation attempts per hour per IP/identifier
  RETURN public.check_rate_limit(
    p_identifier, 
    'invite_validation', 
    10, -- max attempts
    60  -- window in minutes
  );
END;
$$;

-- Fix 3: Add rate limiting for invite creation
-- Create function to check invite creation rate limits
CREATE OR REPLACE FUNCTION public.check_invite_creation_rate_limit(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Allow max 5 invite creations per hour per user
  RETURN public.check_rate_limit(
    p_user_id::text, 
    'invite_creation', 
    5, -- max attempts
    60  -- window in minutes
  );
END;
$$;

-- Add rate limiting to invite creation policy
DROP POLICY IF EXISTS "Controlled invite creation" ON public.invites;
CREATE POLICY "Controlled invite creation with rate limiting" 
  ON public.invites 
  FOR INSERT 
  WITH CHECK (
    auth.uid() = created_by_user_id AND 
    (EXISTS ( SELECT 1
       FROM users
      WHERE ((users.id = auth.uid()) AND 
             (users.is_suspended = false) AND 
             (((users.invites_remaining > 0) AND (users.role <> 'admin'::user_role)) OR 
              (users.role = 'admin'::user_role))))) AND
    public.check_invite_creation_rate_limit(auth.uid())
  );

-- Fix 4: Improve authentication validation RLS
-- Add rate limiting to authentication attempts
CREATE OR REPLACE FUNCTION public.check_auth_rate_limit(p_identifier text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Allow max 5 auth attempts per 15 minutes per IP/identifier
  RETURN public.check_rate_limit(
    p_identifier, 
    'authentication', 
    5, -- max attempts
    15  -- window in minutes
  );
END;
$$;