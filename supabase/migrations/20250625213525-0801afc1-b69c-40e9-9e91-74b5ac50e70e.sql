
-- Phase 1: Critical RLS Policy Cleanup and Security Hardening

-- First, let's clean up overlapping and redundant RLS policies
-- Drop existing problematic policies and recreate them with proper security

-- Clean up users table policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view public profiles" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can set role only if NULL or admin" ON public.users;

-- Create comprehensive, non-overlapping user policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can view verified public profiles" ON public.users
  FOR SELECT 
  USING (
    public_profile = true AND 
    onboarding_completed = true AND 
    role IS NOT NULL AND
    is_suspended = false
  );

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT 
  USING (public.current_user_is_admin());

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE 
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Role assignment security" ON public.users
  FOR UPDATE 
  USING (
    auth.uid() = id AND (
      -- Can only set role if currently NULL (first time) or user is admin
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

-- Clean up gigs table policies
DROP POLICY IF EXISTS "Users can view appropriate gigs" ON public.gigs;
DROP POLICY IF EXISTS "Gig posters can create gigs" ON public.gigs;
DROP POLICY IF EXISTS "Gig posters can update their own gigs" ON public.gigs;
DROP POLICY IF EXISTS "Gig posters can delete their own gigs" ON public.gigs;

-- Create secure gig policies
CREATE POLICY "View open gigs and own gigs" ON public.gigs
  FOR SELECT 
  USING (
    (status = 'open' AND poster_id IN (
      SELECT id FROM public.users WHERE is_suspended = false
    )) OR
    auth.uid() = poster_id OR
    public.current_user_is_admin()
  );

CREATE POLICY "Verified posters can create gigs" ON public.gigs
  FOR INSERT 
  WITH CHECK (
    auth.uid() = poster_id AND 
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('gig_poster', 'admin')
      AND onboarding_completed = true
      AND is_suspended = false
      AND gig_posting_restricted = false
    )
  );

CREATE POLICY "Gig owners can update own gigs" ON public.gigs
  FOR UPDATE 
  USING (
    auth.uid() = poster_id AND 
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND is_suspended = false
      AND gig_posting_restricted = false
    )
  );

CREATE POLICY "Gig owners can delete own gigs" ON public.gigs
  FOR DELETE 
  USING (auth.uid() = poster_id OR public.current_user_is_admin());

-- Clean up applications table policies
DROP POLICY IF EXISTS "Enhanced application visibility" ON public.applications;
DROP POLICY IF EXISTS "Gig seekers can create applications" ON public.applications;
DROP POLICY IF EXISTS "Applicants can update their own applications" ON public.applications;
DROP POLICY IF EXISTS "Applicants can delete their own applications" ON public.applications;
DROP POLICY IF EXISTS "Gig posters can update application status" ON public.applications;

-- Create secure application policies
CREATE POLICY "Application visibility control" ON public.applications
  FOR SELECT 
  USING (
    auth.uid() = seeker_id OR 
    auth.uid() IN (
      SELECT poster_id FROM public.gigs 
      WHERE id = gig_id AND poster_id IN (
        SELECT id FROM public.users WHERE is_suspended = false
      )
    ) OR
    public.current_user_is_admin()
  );

CREATE POLICY "Verified seekers can apply" ON public.applications
  FOR INSERT 
  WITH CHECK (
    auth.uid() = seeker_id AND
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND role IN ('gig_seeker', 'admin')
      AND onboarding_completed = true
      AND is_suspended = false
      AND messaging_restricted = false
    ) AND
    EXISTS (
      SELECT 1 FROM public.gigs 
      WHERE id = gig_id 
      AND status = 'open'
      AND poster_id != auth.uid() -- Prevent self-applications
    )
  );

CREATE POLICY "Applicants manage own applications" ON public.applications
  FOR UPDATE 
  USING (
    auth.uid() = seeker_id AND 
    status = 'pending' AND -- Only pending applications can be updated by applicants
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND is_suspended = false
    )
  );

CREATE POLICY "Applicants can withdraw applications" ON public.applications
  FOR DELETE 
  USING (
    auth.uid() = seeker_id AND 
    status IN ('pending', 'reviewed')
  );

CREATE POLICY "Gig posters manage application status" ON public.applications
  FOR UPDATE 
  USING (
    auth.uid() IN (
      SELECT poster_id FROM public.gigs 
      WHERE id = gig_id AND poster_id IN (
        SELECT id FROM public.users WHERE is_suspended = false
      )
    ) OR
    public.current_user_is_admin()
  );

-- Secure invites table policies
DROP POLICY IF EXISTS "Users can view their own invites" ON public.invites;
DROP POLICY IF EXISTS "Users can create invites if they have remaining or are admin" ON public.invites;
DROP POLICY IF EXISTS "Anyone can read invite tokens for redemption" ON public.invites;
DROP POLICY IF EXISTS "Invite creators can update their unused invites" ON public.invites;
DROP POLICY IF EXISTS "Invite creators can delete their unused invites" ON public.invites;

-- Create secure invite policies with rate limiting considerations
CREATE POLICY "Users view own created invites" ON public.invites
  FOR SELECT 
  USING (
    auth.uid() = created_by_user_id AND
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND is_suspended = false
    )
  );

CREATE POLICY "Controlled invite creation" ON public.invites
  FOR INSERT 
  WITH CHECK (
    auth.uid() = created_by_user_id AND 
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND is_suspended = false
      AND (
        (invites_remaining > 0 AND role != 'admin') OR
        (role = 'admin')
      )
    )
  );

CREATE POLICY "Public invite validation" ON public.invites
  FOR SELECT 
  USING (
    used_by_user_id IS NULL AND 
    expires_at > now() AND
    created_by_user_id IN (
      SELECT id FROM public.users WHERE is_suspended = false
    )
  );

CREATE POLICY "Invite creators manage unused invites" ON public.invites
  FOR UPDATE 
  USING (
    auth.uid() = created_by_user_id AND 
    used_by_user_id IS NULL AND
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND is_suspended = false
    )
  );

CREATE POLICY "Invite creators delete unused invites" ON public.invites
  FOR DELETE 
  USING (
    auth.uid() = created_by_user_id AND 
    used_by_user_id IS NULL AND
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE id = auth.uid() 
      AND is_suspended = false
    )
  );

-- Add security audit logging table
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  action_type TEXT NOT NULL,
  resource_type TEXT NOT NULL,
  resource_id UUID,
  details JSONB DEFAULT '{}',
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Only admins can view audit logs" ON public.security_audit_log
  FOR SELECT 
  USING (public.current_user_is_admin());

-- Anyone can insert audit logs (for system logging)
CREATE POLICY "System can insert audit logs" ON public.security_audit_log
  FOR INSERT 
  WITH CHECK (true);

-- Add rate limiting table for various actions
CREATE TABLE IF NOT EXISTS public.rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  identifier TEXT NOT NULL, -- Can be user_id, IP, or other identifier
  action_type TEXT NOT NULL,
  attempt_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(identifier, action_type, window_start)
);

-- Enable RLS on rate limits
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Only system and admins can manage rate limits
CREATE POLICY "Admins can view rate limits" ON public.rate_limits
  FOR SELECT 
  USING (public.current_user_is_admin());

CREATE POLICY "System can manage rate limits" ON public.rate_limits
  FOR ALL 
  USING (public.current_user_is_admin());

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_id ON public.security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_created_at ON public.security_audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_rate_limits_identifier_action ON public.rate_limits(identifier, action_type);
CREATE INDEX IF NOT EXISTS idx_rate_limits_window_start ON public.rate_limits(window_start);

-- Function to log security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  p_user_id UUID,
  p_action_type TEXT,
  p_resource_type TEXT,
  p_resource_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT '{}',
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO public.security_audit_log (
    user_id, action_type, resource_type, resource_id, 
    details, ip_address, user_agent
  ) VALUES (
    p_user_id, p_action_type, p_resource_type, p_resource_id,
    p_details, p_ip_address, p_user_agent
  ) RETURNING id INTO log_id;
  
  RETURN log_id;
END;
$$;

-- Function to check and update rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
  p_identifier TEXT,
  p_action_type TEXT,
  p_max_attempts INTEGER DEFAULT 5,
  p_window_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_window TIMESTAMP WITH TIME ZONE;
  current_attempts INTEGER;
BEGIN
  -- Calculate current window start
  current_window := date_trunc('hour', now()) + 
    (EXTRACT(minute FROM now())::INTEGER / p_window_minutes) * 
    (p_window_minutes || ' minutes')::INTERVAL;
  
  -- Get current attempt count for this window
  SELECT COALESCE(attempt_count, 0) INTO current_attempts
  FROM public.rate_limits 
  WHERE identifier = p_identifier 
    AND action_type = p_action_type 
    AND window_start = current_window;
  
  -- Check if limit exceeded
  IF current_attempts >= p_max_attempts THEN
    RETURN FALSE;
  END IF;
  
  -- Update or insert rate limit record
  INSERT INTO public.rate_limits (identifier, action_type, window_start, attempt_count)
  VALUES (p_identifier, p_action_type, current_window, 1)
  ON CONFLICT (identifier, action_type, window_start)
  DO UPDATE SET 
    attempt_count = rate_limits.attempt_count + 1,
    updated_at = now();
  
  RETURN TRUE;
END;
$$;

-- Clean up expired rate limit records (run this periodically)
CREATE OR REPLACE FUNCTION public.cleanup_expired_rate_limits()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.rate_limits 
  WHERE window_start < now() - INTERVAL '24 hours';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;
