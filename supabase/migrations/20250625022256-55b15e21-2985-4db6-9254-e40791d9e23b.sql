
-- Create user roles enum
CREATE TYPE public.user_role AS ENUM ('gig_poster', 'gig_seeker', 'admin');

-- Create gig status enum
CREATE TYPE public.gig_status AS ENUM ('draft', 'open', 'in_progress', 'completed', 'cancelled');

-- Create application status enum
CREATE TYPE public.application_status AS ENUM ('pending', 'reviewed', 'accepted', 'rejected', 'withdrawn');

-- Create users table (extends auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'gig_seeker',
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create gigs table
CREATE TABLE public.gigs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poster_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  budget DECIMAL(10,2),
  timeline TEXT,
  status gig_status DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id UUID REFERENCES public.gigs(id) ON DELETE CASCADE NOT NULL,
  seeker_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  pitch_text TEXT NOT NULL,
  status application_status DEFAULT 'pending',
  attachments TEXT[], -- Array of file URLs
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(gig_id, seeker_id) -- Prevent duplicate applications
);

-- Create feature_flags table
CREATE TABLE public.feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  flag_name TEXT UNIQUE NOT NULL,
  enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert initial feature flags
INSERT INTO public.feature_flags (flag_name, enabled) VALUES
  ('messaging', true),
  ('reviews', false),
  ('milestone_tracking', false),
  ('application_filters', true);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('attachments', 'attachments', false);

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID)
RETURNS user_role
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.users WHERE id = user_id;
$$;

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
  SELECT role = 'admin' FROM public.users WHERE id = user_id;
$$;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all users" ON public.users
  FOR SELECT USING (public.is_admin(auth.uid()));

-- RLS Policies for gigs table
CREATE POLICY "Anyone can view open gigs" ON public.gigs
  FOR SELECT USING (status = 'open' OR poster_id = auth.uid());

CREATE POLICY "Gig posters can create gigs" ON public.gigs
  FOR INSERT WITH CHECK (
    auth.uid() = poster_id AND 
    public.get_user_role(auth.uid()) IN ('gig_poster', 'admin')
  );

CREATE POLICY "Gig posters can update their own gigs" ON public.gigs
  FOR UPDATE USING (auth.uid() = poster_id);

CREATE POLICY "Gig posters can delete their own gigs" ON public.gigs
  FOR DELETE USING (auth.uid() = poster_id);

-- RLS Policies for applications table
CREATE POLICY "Users can view applications for their gigs or their own applications" ON public.applications
  FOR SELECT USING (
    auth.uid() = seeker_id OR 
    auth.uid() IN (SELECT poster_id FROM public.gigs WHERE id = gig_id)
  );

CREATE POLICY "Gig seekers can create applications" ON public.applications
  FOR INSERT WITH CHECK (
    auth.uid() = seeker_id AND
    public.get_user_role(auth.uid()) IN ('gig_seeker', 'admin')
  );

CREATE POLICY "Applicants can update their own applications" ON public.applications
  FOR UPDATE USING (auth.uid() = seeker_id);

CREATE POLICY "Applicants can delete their own applications" ON public.applications
  FOR DELETE USING (auth.uid() = seeker_id);

-- RLS Policies for feature_flags table
CREATE POLICY "Anyone can view feature flags" ON public.feature_flags
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Only admins can modify feature flags" ON public.feature_flags
  FOR ALL USING (public.is_admin(auth.uid()));

-- Storage policies for attachments bucket
CREATE POLICY "Authenticated users can upload attachments" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'attachments' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can view their own attachments" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'attachments' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own attachments" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'attachments' AND 
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Create trigger to automatically create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'display_name', NEW.email),
    COALESCE((NEW.raw_user_meta_data->>'role')::user_role, 'gig_seeker')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
