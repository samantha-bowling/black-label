
-- Complete Invites Table Policies
CREATE POLICY "Invite creators can update their unused invites" 
  ON public.invites 
  FOR UPDATE 
  USING (
    auth.uid() = created_by_user_id AND 
    used_by_user_id IS NULL
  )
  WITH CHECK (
    auth.uid() = created_by_user_id AND 
    used_by_user_id IS NULL
  );

CREATE POLICY "Invite creators can delete their unused invites" 
  ON public.invites 
  FOR DELETE 
  USING (
    auth.uid() = created_by_user_id AND 
    used_by_user_id IS NULL
  );

-- Enhance Gig Visibility Controls
DROP POLICY IF EXISTS "Anyone can view open gigs" ON public.gigs;

CREATE POLICY "Users can view appropriate gigs" 
  ON public.gigs 
  FOR SELECT 
  USING (
    -- Gig creators can always see their own gigs
    auth.uid() = poster_id OR
    -- Others can only see open gigs
    status = 'open' OR
    -- Admins can see all gigs
    public.current_user_is_admin()
  );

-- Add User Profile Discoverability
ALTER TABLE public.users 
ADD COLUMN public_profile BOOLEAN NOT NULL DEFAULT FALSE;

-- Enhanced user visibility policy
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all users" ON public.users;

CREATE POLICY "Users can view their own profile" 
  ON public.users
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can view public profiles" 
  ON public.users
  FOR SELECT 
  USING (
    public_profile = true AND 
    onboarding_completed = true AND 
    role IS NOT NULL
  );

CREATE POLICY "Admins can view all users" 
  ON public.users
  FOR SELECT 
  USING (public.current_user_is_admin());

-- Application Workflow Enhancement
ALTER TABLE public.applications 
ADD COLUMN reviewed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN reviewer_notes TEXT;

-- Enhanced application visibility
DROP POLICY IF EXISTS "Users can view applications for their gigs or their own applications" ON public.applications;

CREATE POLICY "Enhanced application visibility" 
  ON public.applications
  FOR SELECT 
  USING (
    -- Applicants can always see their own applications
    auth.uid() = seeker_id OR 
    -- Gig posters can see applications for their gigs
    auth.uid() IN (SELECT poster_id FROM public.gigs WHERE id = gig_id) OR
    -- Admins can see all applications
    public.current_user_is_admin()
  );

-- Policy for updating application status (gig posters and admins)
CREATE POLICY "Gig posters can update application status" 
  ON public.applications
  FOR UPDATE 
  USING (
    auth.uid() IN (SELECT poster_id FROM public.gigs WHERE id = gig_id) OR
    public.current_user_is_admin()
  )
  WITH CHECK (
    auth.uid() IN (SELECT poster_id FROM public.gigs WHERE id = gig_id) OR
    public.current_user_is_admin()
  );

-- Contact Messages - Ensure proper admin-only access
DROP POLICY IF EXISTS "Only admins can view contact messages" ON public.contact_messages;
DROP POLICY IF EXISTS "Only admins can update contact messages" ON public.contact_messages;

CREATE POLICY "Only admins can view contact messages" 
  ON public.contact_messages 
  FOR SELECT 
  USING (public.current_user_is_admin());

CREATE POLICY "Only admins can update contact messages" 
  ON public.contact_messages 
  FOR UPDATE 
  USING (public.current_user_is_admin())
  WITH CHECK (public.current_user_is_admin());

CREATE POLICY "Only admins can delete contact messages" 
  ON public.contact_messages 
  FOR DELETE 
  USING (public.current_user_is_admin());

-- Feature Flags - Ensure proper admin-only modification
DROP POLICY IF EXISTS "Only admins can modify feature flags" ON public.feature_flags;

CREATE POLICY "Only admins can insert feature flags" 
  ON public.feature_flags 
  FOR INSERT 
  WITH CHECK (public.current_user_is_admin());

CREATE POLICY "Only admins can update feature flags" 
  ON public.feature_flags 
  FOR UPDATE 
  USING (public.current_user_is_admin())
  WITH CHECK (public.current_user_is_admin());

CREATE POLICY "Only admins can delete feature flags" 
  ON public.feature_flags 
  FOR DELETE 
  USING (public.current_user_is_admin());

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_public_profile ON public.users(public_profile, onboarding_completed, role) WHERE public_profile = true;
CREATE INDEX IF NOT EXISTS idx_applications_status ON public.applications(status);
CREATE INDEX IF NOT EXISTS idx_gigs_status_poster ON public.gigs(status, poster_id);
