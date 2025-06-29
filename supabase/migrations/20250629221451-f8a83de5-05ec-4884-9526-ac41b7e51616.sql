
-- Add years_experience field to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS years_experience INTEGER;

-- Add project_showcase field to store up to 3 projects
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS project_showcase JSONB DEFAULT '[]'::jsonb;

-- Add a check constraint to ensure project_showcase doesn't exceed 3 projects
ALTER TABLE public.users 
ADD CONSTRAINT check_project_showcase_limit 
CHECK (jsonb_array_length(project_showcase) <= 3);

-- Create an index on project_showcase for better query performance
CREATE INDEX IF NOT EXISTS idx_users_project_showcase 
ON public.users USING GIN (project_showcase);

-- Add comments for documentation
COMMENT ON COLUMN public.users.years_experience IS 'Number of years of professional experience';
COMMENT ON COLUMN public.users.project_showcase IS 'Array of up to 3 project objects with name, link, role, dates, and description';
