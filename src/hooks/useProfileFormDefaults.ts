
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
        years_experience: user.years_experience,
        
        // Convert arrays back to form format
        skills: user.skills || [],
        core_disciplines: user.core_disciplines || [],
        project_types: user.project_types || [],
        awards: user.awards || [],
        available_for: user.available_for || [],
        work_style: user.work_style || [],
        
        // Rate information
        rate_type: user.rate_type || null,
        rate_min: user.rate_range_min,
        rate_max: user.rate_range_max,
        
        // Social links
        'social_links.linkedin': socialLinks.linkedin || user.linkedin_url || '',
        'social_links.github': socialLinks.github || '',
        'social_links.website': socialLinks.website || user.website_url || '',
        
        // Gig seeker fields
        availability_status: user.availability_status || '',
        
        // Gig poster fields
        company_name: user.company_name || '',
        poster_type: user.poster_type || undefined,
        typical_budget_min: user.typical_budget_min,
        typical_budget_max: user.typical_budget_max,
        timeline_expectations: user.timeline_expectations || '',
        nda_required: user.nda_required || false,
        
        // Legacy fields
        website_url: user.website_url || '',
        linkedin_url: user.linkedin_url || '',
      });
    }
  }, [user, form]);
}
