-- Fix database function security by setting immutable search paths
-- This addresses the "Function Search Path Mutable" security warnings

-- Update rate limiting functions
CREATE OR REPLACE FUNCTION public.check_invite_validation_rate_limit(p_identifier text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.check_invite_creation_rate_limit(p_user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.check_auth_rate_limit(p_identifier text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Update user role functions
CREATE OR REPLACE FUNCTION public.get_user_role(user_id uuid)
RETURNS user_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM public.users WHERE id = user_id;
$$;

CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role = 'admin' FROM public.users WHERE id = user_id;
$$;

CREATE OR REPLACE FUNCTION public.current_user_is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE((SELECT role = 'admin' FROM public.users WHERE id = auth.uid()), false);
$$;

-- Update URL slug functions
CREATE OR REPLACE FUNCTION public.generate_smart_url_slug(display_name_param text)
RETURNS text
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 0;
BEGIN
  -- Convert display name to URL-friendly slug
  base_slug := lower(trim(regexp_replace(display_name_param, '[^a-zA-Z0-9\s-]', '', 'g')));
  base_slug := regexp_replace(base_slug, '\s+', '-', 'g');
  base_slug := trim(base_slug, '-');
  
  -- Ensure slug is not empty
  IF base_slug = '' THEN
    base_slug := 'user';
  END IF;
  
  final_slug := base_slug;
  
  -- Check for uniqueness and append number if needed
  WHILE EXISTS (SELECT 1 FROM public.users WHERE smart_url_slug = final_slug) LOOP
    counter := counter + 1;
    final_slug := base_slug || '-' || counter;
  END LOOP;
  
  RETURN final_slug;
END;
$$;

CREATE OR REPLACE FUNCTION public.auto_generate_smart_url_slug()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Only generate if display_name changed and smart_url_slug is null
  IF (TG_OP = 'UPDATE' AND OLD.display_name IS DISTINCT FROM NEW.display_name AND NEW.smart_url_slug IS NULL)
     OR (TG_OP = 'INSERT' AND NEW.smart_url_slug IS NULL AND NEW.display_name IS NOT NULL) THEN
    NEW.smart_url_slug := public.generate_smart_url_slug(NEW.display_name);
  END IF;
  
  RETURN NEW;
END;
$$;

-- Update utility functions
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.log_security_event(p_user_id uuid, p_action_type text, p_resource_type text, p_resource_id uuid DEFAULT NULL::uuid, p_details jsonb DEFAULT '{}'::jsonb, p_ip_address inet DEFAULT NULL::inet, p_user_agent text DEFAULT NULL::text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.check_rate_limit(p_identifier text, p_action_type text, p_max_attempts integer DEFAULT 5, p_window_minutes integer DEFAULT 60)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

CREATE OR REPLACE FUNCTION public.cleanup_expired_rate_limits()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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