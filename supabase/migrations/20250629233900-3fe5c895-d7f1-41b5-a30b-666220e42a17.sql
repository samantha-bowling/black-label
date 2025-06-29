
-- Add new profile form fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS core_disciplines text[],
ADD COLUMN IF NOT EXISTS project_types text[],
ADD COLUMN IF NOT EXISTS awards text[],
ADD COLUMN IF NOT EXISTS available_for text[],
ADD COLUMN IF NOT EXISTS work_style text[],
ADD COLUMN IF NOT EXISTS rate_type text CHECK (rate_type IN ('hourly', 'project', 'salary'));

-- Add comments for documentation
COMMENT ON COLUMN public.users.core_disciplines IS 'Primary areas of expertise';
COMMENT ON COLUMN public.users.project_types IS 'Types of projects user enjoys working on';
COMMENT ON COLUMN public.users.awards IS 'Awards and accolades';
COMMENT ON COLUMN public.users.available_for IS 'Types of engagements user is open to';
COMMENT ON COLUMN public.users.work_style IS 'Preferred working arrangements';
COMMENT ON COLUMN public.users.rate_type IS 'Type of rate: hourly, project, or salary';
