
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { ProjectShowcase } from '@/types/auth';
import { useProfileFormSubmission } from '@/hooks/useProfileFormSubmission';
import { useProfileFormDefaults } from '@/hooks/useProfileFormDefaults';
import { BasicInformationSection } from './forms/BasicInformationSection';
import { SocialLinksSection } from './forms/SocialLinksSection';
import { GigSeekerSection } from './forms/GigSeekerSection';
import { GigPosterSection } from './forms/GigPosterSection';

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

export function ProfileForm() {
  const { user } = useAuth();
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

  // Use custom hooks for form defaults and submission
  useProfileFormDefaults(form);
  const { handleSubmit, isUpdating } = useProfileFormSubmission(projectShowcase);

  // Set project showcase from user data
  useState(() => {
    if (user?.project_showcase) {
      setProjectShowcase(user.project_showcase);
    }
  });

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
      <BasicInformationSection form={form} />
      <SocialLinksSection form={form} />
      
      {isGigSeeker && <GigSeekerSection form={form} />}
      {isGigPoster && <GigPosterSection form={form} />}

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
