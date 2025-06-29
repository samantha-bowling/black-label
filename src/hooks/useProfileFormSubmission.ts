
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PosterType, ProjectShowcase } from '@/types/auth';

interface ProfileFormData {
  display_name: string;
  bio?: string;
  location?: string;
  skills?: string;
  past_credits?: string;
  'social_links.linkedin'?: string;
  'social_links.github'?: string;
  'social_links.website'?: string;
  availability_status?: string;
  rate_range_min?: number;
  rate_range_max?: number;
  desired_gig_types?: string;
  company_name?: string;
  poster_type?: string;
  typical_budget_min?: number;
  typical_budget_max?: number;
  timeline_expectations?: string;
  nda_required?: boolean;
  website_url?: string;
  linkedin_url?: string;
  years_experience?: number;
}

export function useProfileFormSubmission(projectShowcase: ProjectShowcase[]) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    setIsUpdating(true);

    try {
      // Prepare social links object
      const socialLinks = {
        linkedin: data['social_links.linkedin'] || data.linkedin_url || null,
        github: data['social_links.github'] || null,
        website: data['social_links.website'] || data.website_url || null,
      };

      // Remove empty values
      Object.keys(socialLinks).forEach(key => {
        if (!socialLinks[key as keyof typeof socialLinks]) {
          delete socialLinks[key as keyof typeof socialLinks];
        }
      });

      // Safely cast poster_type to PosterType or null
      const posterType = data.poster_type && 
        ['individual', 'indie_dev', 'studio', 'agency', 'publisher'].includes(data.poster_type) 
        ? data.poster_type as PosterType 
        : null;

      const updateData = {
        display_name: data.display_name,
        bio: data.bio || null,
        location: data.location || null,
        skills: data.skills ? data.skills.split(',').map(s => s.trim()).filter(s => s) : null,
        past_credits: data.past_credits || null,
        social_links: Object.keys(socialLinks).length > 0 ? socialLinks : null,
        // Gig seeker fields
        availability_status: data.availability_status || null,
        rate_range_min: data.rate_range_min || null,
        rate_range_max: data.rate_range_max || null,
        desired_gig_types: data.desired_gig_types ? data.desired_gig_types.split(',').map(s => s.trim()).filter(s => s) : null,
        // Gig poster fields
        company_name: data.company_name || null,
        poster_type: posterType,
        typical_budget_min: data.typical_budget_min || null,
        typical_budget_max: data.typical_budget_max || null,
        timeline_expectations: data.timeline_expectations || null,
        nda_required: data.nda_required || false,
        // Legacy fields for backward compatibility
        website_url: socialLinks.website || null,
        linkedin_url: socialLinks.linkedin || null,
        // New Phase 1 fields
        years_experience: data.years_experience || null,
        project_showcase: projectShowcase as any,
      };

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });

      // Refresh page to show changes
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update your profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    handleSubmit,
    isUpdating,
  };
}
