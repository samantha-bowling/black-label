
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';

export function useProfileFormDefaults(form: UseFormReturn<any>) {
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      const socialLinks = user.social_links || {};
      
      form.reset({
        display_name: user.displayName || '',
        bio: user.bio || '',
        location: user.location || '',
        skills: user.skills?.join(', ') || '',
        past_credits: user.past_credits || '',
        'social_links.linkedin': socialLinks.linkedin || user.linkedin_url || '',
        'social_links.github': socialLinks.github || '',
        'social_links.website': socialLinks.website || user.website_url || '',
        availability_status: user.availability_status || '',
        rate_range_min: user.rate_range_min,
        rate_range_max: user.rate_range_max,
        desired_gig_types: user.desired_gig_types?.join(', ') || '',
        company_name: user.company_name || '',
        poster_type: user.poster_type || undefined,
        typical_budget_min: user.typical_budget_min,
        typical_budget_max: user.typical_budget_max,
        timeline_expectations: user.timeline_expectations || '',
        nda_required: user.nda_required || false,
        website_url: user.website_url || '',
        linkedin_url: user.linkedin_url || '',
        years_experience: user.years_experience,
      });
    }
  }, [user, form]);
}
