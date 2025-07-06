-- Phase 1: Remove Payment Infrastructure
-- This migration removes all payment-related tables, columns, enums and policies

-- Step 1: Drop the payments table and its policies
DROP POLICY IF EXISTS "Users can view their own payments" ON public.payments;
DROP POLICY IF EXISTS "Users can insert their own payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can view all payments" ON public.payments;
DROP POLICY IF EXISTS "Admins can update all payments" ON public.payments;

-- Drop the payments table
DROP TABLE IF EXISTS public.payments CASCADE;

-- Step 2: Remove payment-related columns from collaboration_requests
-- The collaboration_requests table will become a pure lead capture system
ALTER TABLE public.collaboration_requests 
DROP COLUMN IF EXISTS status CASCADE;

-- Add a simple status for lead management instead
ALTER TABLE public.collaboration_requests 
ADD COLUMN status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'qualified', 'converted', 'closed'));

-- Step 3: Drop payment-related enums
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS collaboration_status CASCADE;

-- Step 4: Remove brief_status from gigs and make all gigs live by default
ALTER TABLE public.gigs 
DROP COLUMN IF EXISTS brief_status CASCADE,
DROP COLUMN IF EXISTS approved_at CASCADE,
DROP COLUMN IF EXISTS approved_by_user_id CASCADE,
DROP COLUMN IF EXISTS admin_notes CASCADE;

-- Drop the brief_status enum
DROP TYPE IF EXISTS brief_status CASCADE;

-- Step 5: Clean up indexes related to payments
DROP INDEX IF EXISTS idx_payments_user_id;
DROP INDEX IF EXISTS idx_payments_stripe_session_id;
DROP INDEX IF EXISTS idx_collaboration_requests_status;

-- Step 6: Update gigs RLS policies to remove approval workflow
DROP POLICY IF EXISTS "Posters can update their draft gigs" ON public.gigs;
DROP POLICY IF EXISTS "Seekers can view active gigs" ON public.gigs;
DROP POLICY IF EXISTS "Admins can update all gigs" ON public.gigs;

-- Create simplified gig policies for lead generation
CREATE POLICY "Anyone can view open gigs" 
  ON public.gigs 
  FOR SELECT 
  USING (status = 'open');

CREATE POLICY "Gig owners can manage their gigs" 
  ON public.gigs 
  FOR ALL 
  USING (poster_id = auth.uid() OR current_user_is_admin());

-- Step 7: Update collaboration_requests policies for lead generation
DROP POLICY IF EXISTS "Admins can update all collaboration requests" ON public.collaboration_requests;
DROP POLICY IF EXISTS "Admins can view all collaboration requests" ON public.collaboration_requests;
DROP POLICY IF EXISTS "Posters can create collaboration requests" ON public.collaboration_requests;
DROP POLICY IF EXISTS "Seekers can update requests sent to them" ON public.collaboration_requests;
DROP POLICY IF EXISTS "Seekers can view requests sent to them" ON public.collaboration_requests;
DROP POLICY IF EXISTS "Posters can view their sent requests" ON public.collaboration_requests;

-- Create simplified lead generation policies
CREATE POLICY "Anyone can create collaboration requests" 
  ON public.collaboration_requests 
  FOR INSERT 
  WITH CHECK (poster_id = auth.uid());

CREATE POLICY "Posters can view their sent requests" 
  ON public.collaboration_requests 
  FOR SELECT 
  USING (poster_id = auth.uid());

CREATE POLICY "Recipients can view and respond to requests" 
  ON public.collaboration_requests 
  FOR SELECT 
  USING (seeker_id = auth.uid());

CREATE POLICY "Recipients can update their response" 
  ON public.collaboration_requests 
  FOR UPDATE 
  USING (seeker_id = auth.uid());

CREATE POLICY "Admins can view all collaboration requests" 
  ON public.collaboration_requests 
  FOR ALL 
  USING (current_user_is_admin());