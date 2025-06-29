
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
  years_experience?: number;
  skills?: string[];
  core_disciplines?: string[];
  project_types?: string[];
  awards?: string[];
  available_for?: string[];
  work_style?: string[];
  rate_type?: 'hourly' | 'project' | 'salary' | null;
  rate_min?: number;
  rate_max?: number;
  'social_links.linkedin'?: string;
  'social_links.github'?: string;
  'social_links.website'?: string;
  availability_status?: string;
  company_name?: string;
  poster_type?: string;
  typical_budget_min?: number;
  typical_budget_max?: number;
  timeline_expectations?: string;
  nda_required?: boolean;
  website_url?: string;
  linkedin_url?: string;
}

export function ProfileForm() {
  const { user } = useAuth();
  const [projectShowcase, setProjectShowcase] = useState<ProjectShowcase[]>([]);

  const form = useForm<ProfileFormData>({
    defaultValues: {
      display_name: '',
      bio: '',
      location: '',
      years_experience: undefined,
      skills: [],
      core_disciplines: [],
      project_types: [],
      awards: [],
      available_for: [],
      work_style: [],
      rate_type: null,
      rate_min: undefined,
      rate_max: undefined,
      'social_links.linkedin': '',
      'social_links.github': '',
      'social_links.website': '',
      availability_status: '',
      company_name: '',
      poster_type: undefined,
      typical_budget_min: undefined,
      typical_budget_max: undefined,
      timeline_expectations: '',
      nda_required: false,
      website_url: '',
      linkedin_url: '',
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
