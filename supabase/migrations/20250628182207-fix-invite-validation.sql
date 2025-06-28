
-- Create the validate_invite_token function that the edge function expects
CREATE OR REPLACE FUNCTION public.validate_invite_token(token_param UUID)
RETURNS TABLE (
  is_valid BOOLEAN,
  created_by_user_id UUID,
  email TEXT,
  expires_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    CASE 
      WHEN i.token IS NOT NULL 
        AND i.used_by_user_id IS NULL 
        AND i.expires_at > now() 
      THEN TRUE 
      ELSE FALSE 
    END as is_valid,
    i.created_by_user_id,
    i.email,
    i.expires_at
  FROM public.invites i
  WHERE i.token = token_param;
  
  -- If no record found, return a row with false
  IF NOT FOUND THEN
    RETURN QUERY
    SELECT FALSE, NULL::UUID, NULL::TEXT, NULL::TIMESTAMP WITH TIME ZONE;
  END IF;
END;
$$;
