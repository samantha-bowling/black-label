
-- Add unique constraint to prevent duplicate user-tag combinations
CREATE UNIQUE INDEX IF NOT EXISTS user_profile_tags_user_tag_idx 
ON public.user_profile_tags (user_id, tag_id);

-- Update RLS policies for user_profile_tags to be more permissive for viewing
DROP POLICY IF EXISTS "Users can view all user profile tags" ON public.user_profile_tags;
CREATE POLICY "Users can view all user profile tags" 
  ON public.user_profile_tags 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Ensure users can manage their own tags properly
DROP POLICY IF EXISTS "Users can manage their own profile tags" ON public.user_profile_tags;
CREATE POLICY "Users can insert their own profile tags" 
  ON public.user_profile_tags 
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile tags" 
  ON public.user_profile_tags 
  FOR UPDATE 
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own profile tags" 
  ON public.user_profile_tags 
  FOR DELETE 
  TO authenticated
  USING (auth.uid() = user_id);
