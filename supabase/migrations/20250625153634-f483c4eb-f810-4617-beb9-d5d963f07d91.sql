
-- Create enum for tag categories
CREATE TYPE public.tag_category AS ENUM ('core_discipline', 'specialty_skill', 'project_type');

-- Create profile_tags table for master tag repository
CREATE TABLE public.profile_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category public.tag_category NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique constraint on name + category combination
CREATE UNIQUE INDEX profile_tags_name_category_idx ON public.profile_tags (name, category);

-- Create user_profile_tags junction table
CREATE TABLE public.user_profile_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES public.profile_tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique constraint to prevent duplicate user-tag combinations
CREATE UNIQUE INDEX user_profile_tags_user_tag_idx ON public.user_profile_tags (user_id, tag_id);

-- Enable RLS on both tables
ALTER TABLE public.profile_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profile_tags ENABLE ROW LEVEL SECURITY;

-- RLS policies for profile_tags (read-only for all authenticated users)
CREATE POLICY "Anyone can view active profile tags" 
  ON public.profile_tags 
  FOR SELECT 
  USING (is_active = true);

-- RLS policies for user_profile_tags
CREATE POLICY "Users can view all user profile tags" 
  ON public.user_profile_tags 
  FOR SELECT 
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own profile tags" 
  ON public.user_profile_tags 
  FOR ALL 
  USING (auth.uid() = user_id);

-- Insert Core Disciplines tags
INSERT INTO public.profile_tags (name, category, sort_order) VALUES
('Studio Leadership', 'core_discipline', 1),
('Creative Direction', 'core_discipline', 2),
('Art Direction', 'core_discipline', 3),
('Game Design', 'core_discipline', 4),
('Systems Design', 'core_discipline', 5),
('Level Design', 'core_discipline', 6),
('Narrative Design', 'core_discipline', 7),
('UX Design', 'core_discipline', 8),
('UI Design', 'core_discipline', 9),
('Technical Design', 'core_discipline', 10),
('Gameplay Engineering', 'core_discipline', 11),
('Backend Engineering', 'core_discipline', 12),
('Tools Engineering', 'core_discipline', 13),
('Network Engineering', 'core_discipline', 14),
('DevOps / Infrastructure', 'core_discipline', 15),
('Technical Art', 'core_discipline', 16),
('Character Art', 'core_discipline', 17),
('Environment Art', 'core_discipline', 18),
('Concept Art', 'core_discipline', 19),
('Animation', 'core_discipline', 20),
('VFX', 'core_discipline', 21),
('Audio Design', 'core_discipline', 22),
('Music Composition', 'core_discipline', 23),
('Production / Project Management', 'core_discipline', 24),
('Marketing & Brand Strategy', 'core_discipline', 25);

-- Insert Specialty Skills tags
INSERT INTO public.profile_tags (name, category, sort_order) VALUES
-- Technical & Engineering
('Unreal Engine (Blueprints)', 'specialty_skill', 1),
('Unreal Engine (C++)', 'specialty_skill', 2),
('Unity', 'specialty_skill', 3),
('Custom Engine', 'specialty_skill', 4),
('Multiplayer Netcode', 'specialty_skill', 5),
('Gameplay Scripting', 'specialty_skill', 6),
('Tools Development', 'specialty_skill', 7),
('Build Pipelines', 'specialty_skill', 8),
('CI/CD Systems', 'specialty_skill', 9),
('Cloud Infrastructure', 'specialty_skill', 10),
('Databases & Persistence', 'specialty_skill', 11),
-- Visual & Audio
('Stylized Art', 'specialty_skill', 12),
('Photorealism', 'specialty_skill', 13),
('Shader Development', 'specialty_skill', 14),
('Rigging & Skinning', 'specialty_skill', 15),
('2D Animation', 'specialty_skill', 16),
('3D Animation', 'specialty_skill', 17),
('Audio Middleware (Wwise, FMOD)', 'specialty_skill', 18),
('Adaptive Music Systems', 'specialty_skill', 19),
('Sound Effects Design', 'specialty_skill', 20),
('Foley / Field Recording', 'specialty_skill', 21),
-- Design & Narrative
('Combat Systems', 'specialty_skill', 22),
('Progression Design', 'specialty_skill', 23),
('Monetization Design', 'specialty_skill', 24),
('Dialogue Writing', 'specialty_skill', 25),
('Branching Narrative', 'specialty_skill', 26),
('Worldbuilding', 'specialty_skill', 27),
('Choice-Based Mechanics', 'specialty_skill', 28),
('Puzzle Design', 'specialty_skill', 29),
('Accessibility Design', 'specialty_skill', 30),
('Player Onboarding', 'specialty_skill', 31),
-- Strategic & Production
('LiveOps Strategy', 'specialty_skill', 32),
('Community Engagement', 'specialty_skill', 33),
('Product Roadmapping', 'specialty_skill', 34),
('Localization', 'specialty_skill', 35),
('Cross-functional Leadership', 'specialty_skill', 36),
('Vertical Slice Prototyping', 'specialty_skill', 37),
('Pitch & Publishing Decks', 'specialty_skill', 38),
('Budgeting & Resource Planning', 'specialty_skill', 39);

-- Insert Project Types tags
INSERT INTO public.profile_tags (name, category, sort_order) VALUES
('AAA Console', 'project_type', 1),
('AAA PC', 'project_type', 2),
('Indie', 'project_type', 3),
('Mobile', 'project_type', 4),
('Live Service / GaaS', 'project_type', 5),
('VR', 'project_type', 6),
('AR', 'project_type', 7),
('Web3 / Blockchain', 'project_type', 8),
('Multiplayer PvP', 'project_type', 9),
('Multiplayer Co-op', 'project_type', 10),
('Single-Player Narrative', 'project_type', 11),
('Open World', 'project_type', 12),
('Competitive Shooter', 'project_type', 13),
('Social Sim', 'project_type', 14),
('Turn-Based Strategy', 'project_type', 15),
('Real-Time Strategy', 'project_type', 16),
('Puzzle / Casual', 'project_type', 17),
('Metroidvania', 'project_type', 18),
('Platformer', 'project_type', 19),
('Action-Adventure', 'project_type', 20),
('Survival Horror', 'project_type', 21),
('RPG', 'project_type', 22),
('Roguelike / Roguelite', 'project_type', 23),
('Simulation / Tycoon', 'project_type', 24),
('Rhythm / Music', 'project_type', 25),
('Kids & Family', 'project_type', 26),
('Licensed IP', 'project_type', 27),
('Original IP', 'project_type', 28),
('Franchise Reboot', 'project_type', 29),
('Cross-Media / Transmedia', 'project_type', 30);
