-- Phase 1: Security Hardening & Enhanced Profile Data Model

-- 1. Fix email exposure in users table RLS policies
DROP POLICY IF EXISTS "Users can view verified public profiles" ON public.users;
CREATE POLICY "Users can view verified public profiles" ON public.users
FOR SELECT 
USING (
  public_profile = true 
  AND onboarding_completed = true 
  AND role IS NOT NULL 
  AND is_suspended = false
);

-- 2. Add enhanced profile fields for LinkedIn-style professional profiles
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS professional_headline text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS current_position text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS current_company text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS industry_focus text[];
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS career_level text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS portfolio_website text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS demo_reel_url text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS artstation_url text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS steam_profile_url text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS education jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS certifications jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS languages_spoken text[];
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS time_zone text;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS preferred_project_size text[];
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS collaboration_style text[];
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS notable_game_credits jsonb DEFAULT '[]'::jsonb;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS technical_proficiencies jsonb DEFAULT '{}'::jsonb;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS profile_completion_score integer DEFAULT 0;

-- 3. Create work_experience table for detailed work history
CREATE TABLE IF NOT EXISTS public.work_experience (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  company_name text NOT NULL,
  position_title text NOT NULL,
  employment_type text, -- Full-time, Contract, Freelance, etc.
  start_date date NOT NULL,
  end_date date, -- NULL for current position
  is_current boolean DEFAULT false,
  location text,
  description text,
  key_achievements text[],
  technologies_used text[],
  projects_worked_on jsonb DEFAULT '[]'::jsonb,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on work_experience
ALTER TABLE public.work_experience ENABLE ROW LEVEL SECURITY;

-- RLS policies for work_experience
CREATE POLICY "Users can manage their own work experience" ON public.work_experience
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public can view work experience of public profiles" ON public.work_experience
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = work_experience.user_id 
    AND users.public_profile = true 
    AND users.onboarding_completed = true
  )
);

-- 4. Create technical_skills table for detailed skill tracking
CREATE TABLE IF NOT EXISTS public.technical_skills (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  skill_name text NOT NULL,
  skill_category text NOT NULL, -- Programming, Engine, Art, Audio, etc.
  proficiency_level text NOT NULL, -- Beginner, Intermediate, Advanced, Expert
  years_experience integer,
  last_used_date date,
  is_primary_skill boolean DEFAULT false,
  endorsement_count integer DEFAULT 0,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, skill_name)
);

-- Enable RLS on technical_skills
ALTER TABLE public.technical_skills ENABLE ROW LEVEL SECURITY;

-- RLS policies for technical_skills
CREATE POLICY "Users can manage their own technical skills" ON public.technical_skills
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public can view skills of public profiles" ON public.technical_skills
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = technical_skills.user_id 
    AND users.public_profile = true 
    AND users.onboarding_completed = true
  )
);

-- 5. Create game_credits table for professional game industry credits
CREATE TABLE IF NOT EXISTS public.game_credits (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  game_title text NOT NULL,
  role text NOT NULL,
  company_studio text,
  platform text[], -- PC, PlayStation, Xbox, Nintendo Switch, Mobile, etc.
  release_year integer,
  description text,
  is_featured boolean DEFAULT false,
  metacritic_score integer,
  sales_figures text, -- "1M+ copies", "AAA title", etc.
  awards_recognition text[],
  external_link text,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on game_credits
ALTER TABLE public.game_credits ENABLE ROW LEVEL SECURITY;

-- RLS policies for game_credits
CREATE POLICY "Users can manage their own game credits" ON public.game_credits
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public can view game credits of public profiles" ON public.game_credits
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = game_credits.user_id 
    AND users.public_profile = true 
    AND users.onboarding_completed = true
  )
);

-- 6. Create professional_recommendations table
CREATE TABLE IF NOT EXISTS public.professional_recommendations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL, -- Person being recommended
  recommender_name text NOT NULL,
  recommender_title text,
  recommender_company text,
  relationship text NOT NULL, -- "Worked directly with", "Managed", "Was managed by", etc.
  recommendation_text text NOT NULL,
  project_context text, -- Which project/game they worked together on
  is_verified boolean DEFAULT false,
  is_visible boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on professional_recommendations
ALTER TABLE public.professional_recommendations ENABLE ROW LEVEL SECURITY;

-- RLS policies for professional_recommendations
CREATE POLICY "Users can manage their own recommendations" ON public.professional_recommendations
FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Public can view recommendations of public profiles" ON public.professional_recommendations
FOR SELECT USING (
  is_visible = true AND EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = professional_recommendations.user_id 
    AND users.public_profile = true 
    AND users.onboarding_completed = true
  )
);

-- 7. Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_work_experience_user_id ON public.work_experience(user_id);
CREATE INDEX IF NOT EXISTS idx_work_experience_current ON public.work_experience(user_id, is_current);
CREATE INDEX IF NOT EXISTS idx_technical_skills_user_id ON public.technical_skills(user_id);
CREATE INDEX IF NOT EXISTS idx_technical_skills_category ON public.technical_skills(user_id, skill_category);
CREATE INDEX IF NOT EXISTS idx_game_credits_user_id ON public.game_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_game_credits_featured ON public.game_credits(user_id, is_featured);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_id ON public.professional_recommendations(user_id);
CREATE INDEX IF NOT EXISTS idx_users_public_profile ON public.users(public_profile, onboarding_completed) WHERE public_profile = true;

-- 8. Create trigger for updated_at timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to new tables
CREATE TRIGGER update_work_experience_updated_at
  BEFORE UPDATE ON public.work_experience
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_technical_skills_updated_at
  BEFORE UPDATE ON public.technical_skills
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_game_credits_updated_at
  BEFORE UPDATE ON public.game_credits
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_recommendations_updated_at
  BEFORE UPDATE ON public.professional_recommendations
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 9. Function to calculate profile completion score
CREATE OR REPLACE FUNCTION public.calculate_profile_completion_score(user_id_param uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  score integer := 0;
  user_data record;
  work_exp_count integer;
  skills_count integer;
  credits_count integer;
BEGIN
  -- Get user data
  SELECT * INTO user_data FROM public.users WHERE id = user_id_param;
  
  IF user_data.id IS NULL THEN
    RETURN 0;
  END IF;
  
  -- Basic profile information (40 points total)
  IF user_data.display_name IS NOT NULL AND length(user_data.display_name) > 0 THEN score := score + 5; END IF;
  IF user_data.professional_headline IS NOT NULL AND length(user_data.professional_headline) > 0 THEN score := score + 5; END IF;
  IF user_data.bio IS NOT NULL AND length(user_data.bio) > 50 THEN score := score + 10; END IF;
  IF user_data.avatar_url IS NOT NULL THEN score := score + 5; END IF;
  IF user_data.location IS NOT NULL THEN score := score + 5; END IF;
  IF user_data.current_position IS NOT NULL THEN score := score + 5; END IF;
  IF user_data.current_company IS NOT NULL THEN score := score + 5; END IF;
  
  -- Professional details (30 points total)
  IF user_data.years_experience IS NOT NULL THEN score := score + 5; END IF;
  IF user_data.core_disciplines IS NOT NULL AND array_length(user_data.core_disciplines, 1) > 0 THEN score := score + 10; END IF;
  IF user_data.industry_focus IS NOT NULL AND array_length(user_data.industry_focus, 1) > 0 THEN score := score + 5; END IF;
  IF user_data.career_level IS NOT NULL THEN score := score + 5; END IF;
  IF user_data.time_zone IS NOT NULL THEN score := score + 5; END IF;
  
  -- Work experience (15 points)
  SELECT COUNT(*) INTO work_exp_count FROM public.work_experience WHERE user_id = user_id_param;
  IF work_exp_count > 0 THEN score := score + 10; END IF;
  IF work_exp_count > 2 THEN score := score + 5; END IF;
  
  -- Technical skills (10 points)
  SELECT COUNT(*) INTO skills_count FROM public.technical_skills WHERE user_id = user_id_param;
  IF skills_count > 0 THEN score := score + 5; END IF;
  IF skills_count > 5 THEN score := score + 5; END IF;
  
  -- Game credits (5 points)
  SELECT COUNT(*) INTO credits_count FROM public.game_credits WHERE user_id = user_id_param;
  IF credits_count > 0 THEN score := score + 5; END IF;
  
  RETURN LEAST(score, 100); -- Cap at 100%
END;
$$;