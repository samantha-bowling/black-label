// @ts-nocheck

import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { createAuthToasts } from '@/lib/auth/toastUtils';
import { UserRole, PosterType, ProjectShowcase } from '@/types/auth';

interface OnboardingSubmissionConfig {
  userRole: UserRole;
  onComplete: () => void;
}

interface OnboardingFormData {
  display_name: string;
  bio?: string;
  social_links?: Record<string, string>;
  // Gig Seeker fields
  desired_gig_types?: string[];
  availability_status?: string;
  past_credits?: string;
  rate_range_min?: number;
  rate_range_max?: number;
  public_profile?: boolean;
  accepts_intros?: boolean;
  // Gig Poster fields
  company_name?: string;
  typical_budget_min?: number;
  typical_budget_max?: number;
  timeline_expectations?: string;
  nda_required?: boolean;
  poster_type?: PosterType;
  location?: string;
  website_url?: string;
  linkedin_url?: string;
  // New Phase 1 fields
  years_experience?: number;
  project_showcase?: ProjectShowcase[];
}

export function useOnboardingSubmission({ userRole, onComplete }: OnboardingSubmissionConfig) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const toasts = createAuthToasts();

  const handleSubmit = async (data: OnboardingFormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const baseUpdateData = {
        display_name: data.display_name,
        bio: data.bio,
        social_links: data.social_links,
        onboarding_completed: true,
        years_experience: data.years_experience,
        project_showcase: (data.project_showcase || []) as any,
      };

      // Create role-specific data with proper typing
      const roleSpecificData = userRole === 'gig_seeker' ? {
        desired_gig_types: data.desired_gig_types,
        availability_status: data.availability_status,
        past_credits: data.past_credits,
        rate_range_min: data.rate_range_min,
        rate_range_max: data.rate_range_max,
        public_profile: data.public_profile,
        accepts_intros: data.accepts_intros,
      } : {
        company_name: data.company_name,
        typical_budget_min: data.typical_budget_min,
        typical_budget_max: data.typical_budget_max,
        timeline_expectations: data.timeline_expectations,
        nda_required: data.nda_required,
        poster_type: data.poster_type,
        location: data.location,
        website_url: data.website_url,
        linkedin_url: data.linkedin_url,
      };

      const updateData = { ...baseUpdateData, ...roleSpecificData };

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      if (userRole === 'gig_seeker') {
        toasts.onboardingSuccess();
      } else {
        toasts.posterOnboardingSuccess();
      }

      onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toasts.genericError("Failed to save your profile. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleSubmit,
    isLoading,
  };
}
