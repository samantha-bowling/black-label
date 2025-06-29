
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { UserRole, PosterType, ProjectShowcase } from '@/types/auth';
import { useAuth } from '@/hooks/useAuth';
import { useOnboardingSubmission } from '@/hooks/useOnboardingSubmission';
import { getOnboardingConfig } from '@/lib/onboarding/onboardingConfig';
import { OnboardingStep } from './OnboardingStep';
import { SharedOnboardingFields } from './SharedOnboardingFields';
import { ProfileDNATagsStep } from './ProfileDNATagsStep';
import { ProjectShowcaseOnboardingStep } from './ProjectShowcaseOnboardingStep';
import { GigSeekerFields } from './GigSeekerFields';
import { GigPosterFields } from './GigPosterFields';
import { PrivacyProfileSettingsStep } from './PrivacyProfileSettingsStep';
import { ButtonPrimary } from '@/components/ui/primitives';

interface BaseOnboardingFlowProps {
  userRole: UserRole;
  onComplete: () => void;
}

interface OnboardingFormData {
  display_name: string;
  bio?: string;
  location?: string;
  years_experience?: number;
  project_showcase?: ProjectShowcase[];
  social_links?: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
  // Gig Seeker specific
  desired_gig_types?: string[];
  availability_status?: string;
  past_credits?: string;
  rate_range_min?: number;
  rate_range_max?: number;
  rate_visibility?: 'private' | 'verified_only' | 'public';
  public_profile?: boolean;
  accepts_intros?: boolean;
  // Gig Poster specific
  company_name?: string;
  typical_budget_min?: number;
  typical_budget_max?: number;
  timeline_expectations?: string;
  nda_required?: boolean;
  poster_type?: PosterType;
  website_url?: string;
  linkedin_url?: string;
}

export function BaseOnboardingFlow({ userRole, onComplete }: BaseOnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectShowcaseData, setProjectShowcaseData] = useState<ProjectShowcase[]>([]);
  const { user } = useAuth();
  const config = getOnboardingConfig(userRole);
  const { handleSubmit: handleOnboardingSubmit, isLoading } = useOnboardingSubmission({
    userRole,
    onComplete
  });

  const form = useForm<OnboardingFormData>({
    defaultValues: {
      display_name: user?.displayName || '',
      bio: user?.bio || '',
      location: user?.location || '',
      years_experience: user?.years_experience,
      project_showcase: user?.project_showcase || [],
      social_links: user?.social_links || {},
      desired_gig_types: user?.desired_gig_types || [],
      availability_status: user?.availability_status || '',
      past_credits: user?.past_credits || '',
      rate_range_min: user?.rate_range_min,
      rate_range_max: user?.rate_range_max,
      rate_visibility: 'private',
      public_profile: user?.public_profile || false,
      accepts_intros: user?.accepts_intros !== false,
      company_name: user?.company_name || '',
      typical_budget_min: user?.typical_budget_min,
      typical_budget_max: user?.typical_budget_max,
      timeline_expectations: user?.timeline_expectations || '',
      nda_required: user?.nda_required || false,
      poster_type: user?.poster_type || undefined,
      website_url: user?.website_url || '',
      linkedin_url: user?.linkedin_url || '',
    }
  });

  const handleNext = () => {
    if (currentStep < config.totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleProjectShowcaseNext = () => {
    // Store project data and continue
    form.setValue('project_showcase', projectShowcaseData);
    handleNext();
  };

  const currentStepConfig = config.steps[currentStep - 1];

  const renderStepContent = () => {
    const isLastStep = currentStep === config.totalSteps;

    switch (currentStepConfig.component) {
      case 'shared':
        return (
          <form onSubmit={form.handleSubmit(handleNext)} className="space-y-6">
            <SharedOnboardingFields form={form} />
            <div className="flex justify-end">
              <ButtonPrimary type="submit" size="lg">
                Next
              </ButtonPrimary>
            </div>
          </form>
        );

      case 'profile-dna':
        return (
          <ProfileDNATagsStep 
            userId={user?.id || ''}
            userRole={userRole}
            onNext={handleNext}
            onBack={handleBack}
          />
        );

      case 'project-showcase':
        return (
          <ProjectShowcaseOnboardingStep
            userId={user?.id || ''}
            onNext={handleProjectShowcaseNext}
            onBack={handleBack}
            initialData={projectShowcaseData}
          />
        );

      case 'gig-seeker':
        return (
          <form onSubmit={form.handleSubmit(isLastStep ? handleOnboardingSubmit : handleNext)} className="space-y-6">
            <GigSeekerFields form={form} />
            <div className="flex justify-between">
              <ButtonPrimary
                type="button"
                onClick={handleBack}
                size="lg"
                className="bg-white/10 hover:bg-white/20"
              >
                Back
              </ButtonPrimary>
              <ButtonPrimary
                type="submit"
                size="lg"
                isLoading={isLoading}
              >
                {isLastStep ? 'Complete Setup' : 'Next'}
              </ButtonPrimary>
            </div>
          </form>
        );

      case 'gig-poster':
        return (
          <form onSubmit={form.handleSubmit(handleOnboardingSubmit)} className="space-y-6">
            <GigPosterFields form={form} />
            <div className="flex justify-between">
              <ButtonPrimary
                type="button"
                onClick={handleBack}
                size="lg"
                className="bg-white/10 hover:bg-white/20"
              >
                Back
              </ButtonPrimary>
              <ButtonPrimary
                type="submit"
                size="lg"
                isLoading={isLoading}
              >
                Complete Setup
              </ButtonPrimary>
            </div>
          </form>
        );

      case 'privacy':
        return (
          <PrivacyProfileSettingsStep
            form={form}
            onNext={handleNext}
            onBack={handleBack}
            onSubmit={() => form.handleSubmit(handleOnboardingSubmit)()}
            isLoading={isLoading}
          />
        );

      default:
        return null;
    }
  };

  return (
    <OnboardingStep
      title={currentStepConfig.title}
      description={currentStepConfig.description}
      currentStep={currentStep}
      totalSteps={config.totalSteps}
    >
      {renderStepContent()}
    </OnboardingStep>
  );
}
