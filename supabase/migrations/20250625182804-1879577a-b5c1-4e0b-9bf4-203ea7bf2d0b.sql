
-- First, let's add the new enums we'll need
CREATE TYPE poster_type AS ENUM ('individual', 'indie_dev', 'studio', 'agency', 'publisher');
CREATE TYPE budget_range AS ENUM ('under_5k', '5k_15k', '15k_50k', '50k_100k', '100k_plus', 'equity_only');
CREATE TYPE contract_type AS ENUM ('freelance', 'consulting', 'part_time', 'full_time', 'equity');
CREATE TYPE brief_status AS ENUM ('draft', 'pending_review', 'active', 'closed', 'rejected');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE collaboration_status AS ENUM ('pending_payment', 'pending_approval', 'accepted', 'declined', 'expired');

-- Extend the users table with poster-specific fields
ALTER TABLE public.users 
ADD COLUMN poster_type poster_type,
ADD COLUMN location TEXT,
ADD COLUMN website_url TEXT,
ADD COLUMN linkedin_url TEXT;

-- Enhance the gigs table to support our brief system
ALTER TABLE public.gigs
ADD COLUMN project_type_tags TEXT[],
ADD COLUMN skills_needed TEXT[],
ADD COLUMN budget_range budget_range,
ADD COLUMN contract_type contract_type,
ADD COLUMN brief_status brief_status DEFAULT 'draft',
ADD COLUMN collaborator_id UUID REFERENCES public.users(id),
ADD COLUMN admin_notes TEXT,
ADD COLUMN approved_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN approved_by_user_id UUID REFERENCES public.users(id);

-- Create payments table for Stripe transaction tracking
CREATE TABLE public.payments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  gig_id UUID REFERENCES public.gigs(id) ON DELETE SET NULL,
  collaboration_request_id UUID, -- Will reference collaboration_requests table
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent_id TEXT,
  amount INTEGER NOT NULL, -- Amount in cents
  currency TEXT DEFAULT 'usd',
  payment_type TEXT NOT NULL, -- 'gig_posting' or 'direct_intro'
  status payment_status DEFAULT 'pending',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create collaboration_requests table for direct intro workflow
CREATE TABLE public.collaboration_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  poster_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  seeker_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  project_title TEXT NOT NULL,
  description TEXT NOT NULL,
  timeline TEXT NOT NULL,
  budget_range budget_range NOT NULL,
  status collaboration_status DEFAULT 'pending_payment',
  seeker_response TEXT,
  responded_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '30 days'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add foreign key for collaboration_requests in payments table
ALTER TABLE public.payments 
ADD CONSTRAINT fk_payments_collaboration_requests 
FOREIGN KEY (collaboration_request_id) REFERENCES public.collaboration_requests(id) ON DELETE SET NULL;

-- Enable Row Level Security on new tables
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaboration_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for payments table
CREATE POLICY "Users can view their own payments" 
  ON public.payments 
  FOR SELECT 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own payments" 
  ON public.payments 
  FOR INSERT 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admins can view all payments" 
  ON public.payments 
  FOR SELECT 
  USING (public.current_user_is_admin());

CREATE POLICY "Admins can update all payments" 
  ON public.payments 
  FOR UPDATE 
  USING (public.current_user_is_admin());

-- RLS Policies for collaboration_requests table
CREATE POLICY "Posters can view their sent requests" 
  ON public.collaboration_requests 
  FOR SELECT 
  USING (poster_id = auth.uid());

CREATE POLICY "Seekers can view requests sent to them" 
  ON public.collaboration_requests 
  FOR SELECT 
  USING (seeker_id = auth.uid());

CREATE POLICY "Posters can create collaboration requests" 
  ON public.collaboration_requests 
  FOR INSERT 
  WITH CHECK (poster_id = auth.uid());

CREATE POLICY "Seekers can update requests sent to them" 
  ON public.collaboration_requests 
  FOR UPDATE 
  USING (seeker_id = auth.uid());

CREATE POLICY "Admins can view all collaboration requests" 
  ON public.collaboration_requests 
  FOR SELECT 
  USING (public.current_user_is_admin());

CREATE POLICY "Admins can update all collaboration requests" 
  ON public.collaboration_requests 
  FOR UPDATE 
  USING (public.current_user_is_admin());

-- Enhanced RLS policies for gigs table to support brief workflow
DROP POLICY IF EXISTS "Public can view published gigs" ON public.gigs;
DROP POLICY IF EXISTS "Poster can manage their gigs" ON public.gigs;

-- New gigs policies for marketplace workflow
CREATE POLICY "Admins can view all gigs" 
  ON public.gigs 
  FOR SELECT 
  USING (public.current_user_is_admin());

CREATE POLICY "Posters can view their own gigs" 
  ON public.gigs 
  FOR SELECT 
  USING (poster_id = auth.uid());

CREATE POLICY "Seekers can view active gigs" 
  ON public.gigs 
  FOR SELECT 
  USING (brief_status = 'active');

CREATE POLICY "Seekers can view gigs they're invited to collaborate on" 
  ON public.gigs 
  FOR SELECT 
  USING (collaborator_id = auth.uid());

CREATE POLICY "Posters can create gigs" 
  ON public.gigs 
  FOR INSERT 
  WITH CHECK (poster_id = auth.uid());

CREATE POLICY "Posters can update their draft gigs" 
  ON public.gigs 
  FOR UPDATE 
  USING (poster_id = auth.uid() AND brief_status = 'draft');

CREATE POLICY "Admins can update all gigs" 
  ON public.gigs 
  FOR UPDATE 
  USING (public.current_user_is_admin());

-- Create indexes for performance
CREATE INDEX idx_gigs_brief_status ON public.gigs(brief_status);
CREATE INDEX idx_gigs_poster_id ON public.gigs(poster_id);
CREATE INDEX idx_gigs_collaborator_id ON public.gigs(collaborator_id);
CREATE INDEX idx_payments_user_id ON public.payments(user_id);
CREATE INDEX idx_payments_stripe_session_id ON public.payments(stripe_session_id);
CREATE INDEX idx_collaboration_requests_poster_id ON public.collaboration_requests(poster_id);
CREATE INDEX idx_collaboration_requests_seeker_id ON public.collaboration_requests(seeker_id);
CREATE INDEX idx_collaboration_requests_status ON public.collaboration_requests(status);

-- Add updated_at trigger for new tables
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON public.payments
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER collaboration_requests_updated_at
  BEFORE UPDATE ON public.collaboration_requests
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
