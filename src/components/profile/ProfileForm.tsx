
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { FormFieldGroup } from '@/components/forms/FormFieldGroup';
import { PosterType, ProjectShowcase } from '@/types/auth';
import { 
  sharedOnboardingFields, 
  socialLinksFields, 
  gigSeekerWorkPreferencesFields,
  gigSeekerRateFields,
  gigSeekerStoryFields,
  gigPosterCompanyFields,
  gigPosterBudgetFields,
  gigPosterProjectFields,
  gigPosterContactFields
} from '@/lib/forms/fieldConfigs';

interface ProfileFormData {
  display_name: string;
  bio?: string;
  location?: string;
  skills?: string;
  past_credits?: string;
  // Social links
  'social_links.linkedin'?: string;
  'social_links.github'?: string;
  'social_links.website'?: string;
  // Gig seeker fields
  availability_status?: string;
  rate_range_min?: number;
  rate_range_max?: number;
  desired_gig_types?: string;
  // Gig poster fields
  company_name?: string;
  poster_type?: string;
  typical_budget_min?: number;
  typical_budget_max?: number;
  timeline_expectations?: string;
  nda_required?: boolean;
  website_url?: string;
  linkedin_url?: string;
  // New Phase 1 fields
  years_experience?: number;
}

export function ProfileForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [projectShowcase, setProjectShowcase] = useState<ProjectShowcase[]>([]);

  const form = useForm<ProfileFormData>({
    defaultValues: {
      display_name: '',
      bio: '',
      location: '',
      skills: '',
      past_credits: '',
      'social_links.linkedin': '',
      'social_links.github': '',
      'social_links.website': '',
      availability_status: '',
      rate_range_min: undefined,
      rate_range_max: undefined,
      desired_gig_types: '',
      company_name: '',
      poster_type: undefined,
      typical_budget_min: undefined,
      typical_budget_max: undefined,
      timeline_expectations: '',
      nda_required: false,
      website_url: '',
      linkedin_url: '',
      years_experience: undefined,
    }
  });

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

      setProjectShowcase(user.project_showcase || []);
    }
  }, [user, form]);

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
        project_showcase: projectShowcase,
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

  if (!user) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  const isGigSeeker = user.role === 'gig_seeker';
  const isGigPoster = user.role === 'gig_poster';

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <FormFieldGroup
            fields={[
              ...sharedOnboardingFields,
              {
                id: 'location',
                label: 'Location',
                type: 'text',
                placeholder: 'City, Country'
              },
              {
                id: 'years_experience',
                label: 'Years of Professional Experience',
                type: 'number',
                placeholder: 'e.g., 5'
              }
            ]}
            form={form}
            columns={1}
          />
        </CardContent>
      </Card>

      {/* Social Links */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Social Links</CardTitle>
        </CardHeader>
        <CardContent>
          <FormFieldGroup
            fields={socialLinksFields}
            form={form}
            columns={1}
          />
        </CardContent>
      </Card>

      {/* Gig Seeker Specific Fields */}
      {isGigSeeker && (
        <>
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Work Preferences</CardTitle>
            </CardHeader>
            <CardContent>
              <FormFieldGroup
                fields={[
                  ...gigSeekerWorkPreferencesFields,
                  {
                    id: 'desired_gig_types',
                    label: 'Desired Gig Types',
                    type: 'text',
                    placeholder: 'Game Design, Level Design, UI/UX',
                    description: 'Separate with commas'
                  }
                ]}
                form={form}
                columns={1}
              />
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Rate & Experience</CardTitle>
            </CardHeader>
            <CardContent>
              <FormFieldGroup
                fields={[
                  ...gigSeekerRateFields,
                  {
                    id: 'skills',
                    label: 'Skills',
                    type: 'text',
                    placeholder: 'Unity, C#, Game Design, etc.',
                    description: 'Separate with commas'
                  }
                ]}
                form={form}
                columns={2}
              />
              <div className="mt-4">
                <FormFieldGroup
                  fields={gigSeekerStoryFields}
                  form={form}
                  columns={1}
                />
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Gig Poster Specific Fields */}
      {isGigPoster && (
        <>
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Organization Details</CardTitle>
            </CardHeader>
            <CardContent>
              <FormFieldGroup
                fields={gigPosterCompanyFields}
                form={form}
                columns={1}
              />
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Project Information</CardTitle>
            </CardHeader>
            <CardContent>
              <FormFieldGroup
                fields={[...gigPosterBudgetFields, ...gigPosterProjectFields]}
                form={form}
                columns={2}
              />
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Contact Information</CardTitle>
            </CardHeader>
            <CardContent>
              <FormFieldGroup
                fields={gigPosterContactFields}
                form={form}
                columns={2}
              />
            </CardContent>
          </Card>
        </>
      )}

      <Button 
        type="submit" 
        disabled={isUpdating} 
        className="w-full"
        size="lg"
      >
        {isUpdating ? 'Updating...' : 'Save Changes'}
      </Button>
    </form>
  );
}
