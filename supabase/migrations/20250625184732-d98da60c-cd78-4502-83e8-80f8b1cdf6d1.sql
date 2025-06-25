
-- Create enum for report categories
CREATE TYPE public.report_category AS ENUM (
  'inappropriate_content',
  'unprofessional_behavior', 
  'fake_credentials',
  'spam',
  'harassment',
  'contract_violations',
  'quality_concerns',
  'other'
);

-- Create enum for report severity levels
CREATE TYPE public.report_severity AS ENUM (
  'low',
  'medium', 
  'high',
  'critical'
);

-- Create enum for report status
CREATE TYPE public.report_status AS ENUM (
  'pending',
  'under_review',
  'resolved',
  'dismissed'
);

-- Create enum for moderation action types
CREATE TYPE public.moderation_action_type AS ENUM (
  'warning',
  'temporary_suspension',
  'permanent_suspension',
  'profile_flag',
  'search_visibility_reduction',
  'messaging_restriction',
  'gig_posting_restriction'
);

-- Create reports table
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reported_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  category public.report_category NOT NULL,
  severity public.report_severity NOT NULL DEFAULT 'medium',
  status public.report_status NOT NULL DEFAULT 'pending',
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  evidence_urls TEXT[] DEFAULT '{}',
  metadata JSONB DEFAULT '{}',
  is_anonymous BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  reviewed_by_admin_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  admin_notes TEXT,
  resolution_summary TEXT
);

-- Create moderation_actions table
CREATE TABLE public.moderation_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  report_id UUID REFERENCES public.reports(id) ON DELETE SET NULL,
  action_type public.moderation_action_type NOT NULL,
  reason TEXT NOT NULL,
  details TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user_quality_scores table
CREATE TABLE public.user_quality_scores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  overall_score INTEGER NOT NULL DEFAULT 85,
  profile_completeness_score INTEGER NOT NULL DEFAULT 85,
  community_feedback_score INTEGER NOT NULL DEFAULT 85,
  compliance_score INTEGER NOT NULL DEFAULT 100,
  total_reports_count INTEGER NOT NULL DEFAULT 0,
  resolved_reports_count INTEGER NOT NULL DEFAULT 0,
  last_calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add moderation-related fields to users table
ALTER TABLE public.users 
ADD COLUMN is_suspended BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN suspension_expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN search_visibility_reduced BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN messaging_restricted BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN gig_posting_restricted BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN moderation_notes TEXT;

-- Enable RLS on new tables
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.moderation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quality_scores ENABLE ROW LEVEL SECURITY;

-- RLS policies for reports table
CREATE POLICY "Users can view reports they created" 
  ON public.reports 
  FOR SELECT 
  USING (reporter_id = auth.uid() OR public.current_user_is_admin());

CREATE POLICY "Users can create reports" 
  ON public.reports 
  FOR INSERT 
  WITH CHECK (reporter_id = auth.uid() OR reporter_id IS NULL);

CREATE POLICY "Admins can update reports" 
  ON public.reports 
  FOR UPDATE 
  USING (public.current_user_is_admin());

-- RLS policies for moderation_actions table
CREATE POLICY "Admins can manage moderation actions" 
  ON public.moderation_actions 
  FOR ALL 
  USING (public.current_user_is_admin());

CREATE POLICY "Users can view their own moderation actions" 
  ON public.moderation_actions 
  FOR SELECT 
  USING (user_id = auth.uid() OR public.current_user_is_admin());

-- RLS policies for user_quality_scores table
CREATE POLICY "Users can view their own quality score" 
  ON public.user_quality_scores 
  FOR SELECT 
  USING (user_id = auth.uid() OR public.current_user_is_admin());

CREATE POLICY "Admins can manage quality scores" 
  ON public.user_quality_scores 
  FOR ALL 
  USING (public.current_user_is_admin());

-- Create indexes for performance
CREATE INDEX idx_reports_status ON public.reports(status);
CREATE INDEX idx_reports_severity ON public.reports(severity);
CREATE INDEX idx_reports_reported_user ON public.reports(reported_user_id);
CREATE INDEX idx_reports_created_at ON public.reports(created_at DESC);
CREATE INDEX idx_moderation_actions_user ON public.moderation_actions(user_id);
CREATE INDEX idx_moderation_actions_active ON public.moderation_actions(is_active);
CREATE INDEX idx_user_quality_scores_user ON public.user_quality_scores(user_id);

-- Create triggers for updated_at timestamps
CREATE TRIGGER handle_updated_at_reports
  BEFORE UPDATE ON public.reports
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_moderation_actions
  BEFORE UPDATE ON public.moderation_actions
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at_user_quality_scores
  BEFORE UPDATE ON public.user_quality_scores
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
