
-- Create contact_messages table to store contact form submissions
CREATE TABLE public.contact_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) NULL,
  ip_address INET,
  user_agent TEXT,
  referrer_page TEXT,
  inquiry_category TEXT DEFAULT 'general',
  company_organization TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policy that allows anyone to insert contact messages
CREATE POLICY "Anyone can submit contact messages" 
  ON public.contact_messages 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy that only allows admins to view contact messages
CREATE POLICY "Only admins can view contact messages" 
  ON public.contact_messages 
  FOR SELECT 
  USING (public.current_user_is_admin());

-- Create policy that only allows admins to update contact messages
CREATE POLICY "Only admins can update contact messages" 
  ON public.contact_messages 
  FOR UPDATE 
  USING (public.current_user_is_admin());

-- Create index for performance
CREATE INDEX idx_contact_messages_created_at ON public.contact_messages(created_at DESC);
CREATE INDEX idx_contact_messages_email ON public.contact_messages(email);
