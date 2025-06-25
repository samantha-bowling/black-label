
-- Add enhanced_profiles feature flag
INSERT INTO public.feature_flags (flag_name, enabled) 
VALUES ('enhanced_profiles', false)
ON CONFLICT (flag_name) DO UPDATE SET enabled = false;

-- Create storage bucket for profile media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-media',
  'profile-media',
  true,
  10485760, -- 10MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']
);

-- Create storage policies for profile media
CREATE POLICY "Users can upload their own profile media"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'profile-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own profile media"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'profile-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own profile media"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'profile-media' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Profile media is publicly viewable"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-media');

-- Create case_studies table
CREATE TABLE public.case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  project_name TEXT NOT NULL,
  role_played TEXT,
  studio_name TEXT,
  timeline TEXT,
  contributions TEXT[], -- Array of contribution bullet points
  media_url TEXT, -- URL to uploaded media file
  external_link TEXT, -- Optional external link
  display_order INTEGER DEFAULT 0,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on case_studies
ALTER TABLE public.case_studies ENABLE ROW LEVEL SECURITY;

-- RLS policies for case_studies
CREATE POLICY "Users can view their own case studies" 
ON public.case_studies FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own case studies" 
ON public.case_studies FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own case studies" 
ON public.case_studies FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own case studies" 
ON public.case_studies FOR DELETE 
USING (auth.uid() = user_id);

CREATE POLICY "Public can view visible case studies of public profiles"
ON public.case_studies FOR SELECT
USING (
  is_visible = true 
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = case_studies.user_id 
    AND public_profile = true
  )
);

-- Create collaboration_options table
CREATE TABLE public.collaboration_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  option_type TEXT NOT NULL, -- 'fractional', 'consult', 'pitch_review', 'team_build', 'leadership_advisory', etc.
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on collaboration_options
ALTER TABLE public.collaboration_options ENABLE ROW LEVEL SECURITY;

-- RLS policies for collaboration_options
CREATE POLICY "Users can manage their own collaboration options" 
ON public.collaboration_options FOR ALL 
USING (auth.uid() = user_id);

CREATE POLICY "Public can view collaboration options of public profiles"
ON public.collaboration_options FOR SELECT
USING (
  is_active = true 
  AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = collaboration_options.user_id 
    AND public_profile = true
  )
);

-- Add new columns to users table for enhanced profiles
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS banner_image_url TEXT,
ADD COLUMN IF NOT EXISTS banner_background_color TEXT DEFAULT '#000000',
ADD COLUMN IF NOT EXISTS signature_quote TEXT,
ADD COLUMN IF NOT EXISTS expertise_signature TEXT,
ADD COLUMN IF NOT EXISTS about_story TEXT, -- Rich markdown content
ADD COLUMN IF NOT EXISTS smart_url_slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS accepts_intros BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS requires_nda BOOLEAN DEFAULT false;

-- Create index on smart_url_slug for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_smart_url_slug ON public.users(smart_url_slug) WHERE smart_url_slug IS NOT NULL;

-- Create function to generate smart URL slugs
CREATE OR REPLACE FUNCTION public.generate_smart_url_slug(display_name_param TEXT)
RETURNS TEXT AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger to auto-generate smart URL slugs
CREATE OR REPLACE FUNCTION public.auto_generate_smart_url_slug()
RETURNS TRIGGER AS $$
BEGIN
  -- Only generate if display_name changed and smart_url_slug is null
  IF (TG_OP = 'UPDATE' AND OLD.display_name IS DISTINCT FROM NEW.display_name AND NEW.smart_url_slug IS NULL)
     OR (TG_OP = 'INSERT' AND NEW.smart_url_slug IS NULL AND NEW.display_name IS NOT NULL) THEN
    NEW.smart_url_slug := public.generate_smart_url_slug(NEW.display_name);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_auto_generate_smart_url_slug
  BEFORE INSERT OR UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_generate_smart_url_slug();
