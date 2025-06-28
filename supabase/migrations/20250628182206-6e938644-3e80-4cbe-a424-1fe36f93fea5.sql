
-- Create lead_inquiries table to store profile-based leads
CREATE TABLE public.lead_inquiries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  inquirer_name TEXT NOT NULL,
  inquirer_email TEXT NOT NULL,
  inquirer_company TEXT,
  project_title TEXT NOT NULL,
  project_description TEXT NOT NULL,
  project_type TEXT NOT NULL, -- 'contract', 'consulting', 'full_time', 'part_time'
  budget_range TEXT, -- 'under_5k', '5k_15k', '15k_50k', '50k_100k', '100k_plus'
  timeline TEXT NOT NULL,
  additional_details TEXT,
  lead_score INTEGER DEFAULT 50, -- 0-100 scoring system
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'proposal_sent', 'closed_won', 'closed_lost')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  source TEXT DEFAULT 'public_profile', -- Track lead source
  referrer_url TEXT,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  contacted_at TIMESTAMP WITH TIME ZONE,
  follow_up_date TIMESTAMP WITH TIME ZONE
);

-- Create lead_notes table for CRM-style follow-up tracking
CREATE TABLE public.lead_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_inquiry_id UUID NOT NULL REFERENCES public.lead_inquiries(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  note_type TEXT DEFAULT 'general' CHECK (note_type IN ('general', 'call', 'email', 'meeting', 'follow_up')),
  created_by_user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.lead_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies for lead_inquiries
CREATE POLICY "Profile owners can view their leads" 
  ON public.lead_inquiries 
  FOR SELECT 
  USING (profile_user_id = auth.uid());

CREATE POLICY "Anyone can create lead inquiries" 
  ON public.lead_inquiries 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Profile owners can update their leads" 
  ON public.lead_inquiries 
  FOR UPDATE 
  USING (profile_user_id = auth.uid());

CREATE POLICY "Admins can view all lead inquiries" 
  ON public.lead_inquiries 
  FOR SELECT 
  USING (public.current_user_is_admin());

CREATE POLICY "Admins can update all lead inquiries" 
  ON public.lead_inquiries 
  FOR UPDATE 
  USING (public.current_user_is_admin());

-- RLS Policies for lead_notes
CREATE POLICY "Profile owners can manage their lead notes" 
  ON public.lead_notes 
  FOR ALL 
  USING (
    created_by_user_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM public.lead_inquiries 
      WHERE id = lead_inquiry_id AND profile_user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can manage all lead notes" 
  ON public.lead_notes 
  FOR ALL 
  USING (public.current_user_is_admin());

-- Create indexes for performance
CREATE INDEX idx_lead_inquiries_profile_user_id ON public.lead_inquiries(profile_user_id);
CREATE INDEX idx_lead_inquiries_status ON public.lead_inquiries(status);
CREATE INDEX idx_lead_inquiries_created_at ON public.lead_inquiries(created_at);
CREATE INDEX idx_lead_notes_lead_inquiry_id ON public.lead_notes(lead_inquiry_id);

-- Add updated_at trigger
CREATE TRIGGER lead_inquiries_updated_at
  BEFORE UPDATE ON public.lead_inquiries
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
