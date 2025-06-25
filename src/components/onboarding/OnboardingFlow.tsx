
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSession } from '@/hooks/useSession';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/auth';
import { OnboardingStep } from './OnboardingStep';
import { SharedOnboardingFields } from './SharedOnboardingFields';
import { GigSeekerFields } from './GigSeekerFields';
import { GigPosterFields } from './GigPosterFields';
import { ButtonPrimary } from '@/components/ui/primitives';

interface OnboardingFlowProps {
  userRole: UserRole;
  onComplete: () => void;
}

interface OnboardingFormData {
  display_name: string;
  bio?: string;
  social_links?: {
    linkedin?: string;
    github?: string;
    website?: string;
  };
  // Gig Seeker specific
  skills?: string[];
  desired_gig_types?: string[];
  availability_status?: string;
  past_credits?: string;
  rate_range_min?: number;
  rate_range_max?: number;
  // Gig Poster specific
  company_name?: string;
  typical_budget_min?: number;
  typical_budget_max?: number;
  timeline_expectations?: string;
  nda_required?: boolean;
}

export function OnboardingFlow({ userRole, onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { user, upsertUserProgress, refreshUser } = useSession();
  const { toast } = useToast();

  const form = useForm<OnboardingFormData>({
    defaultValues: {
      display_name: user?.displayName || '',
      bio: user?.bio || '',
      social_links: user?.social_links || {},
      skills: user?.skills || [],
      desired_gig_types: user?.desired_gig_types || [],
      availability_status: user?.availability_status || '',
      past_credits: user?.past_credits || '',
      rate_range_min: user?.rate_range_min,
      rate_range_max: user?.rate_range_max,
      company_name: user?.company_name || '',
      typical_budget_min: user?.typical_budget_min,
      typical_budget_max: user?.typical_budget_max,
      timeline_expectations: user?.timeline_expectations || '',
      nda_required: user?.nda_required || false,
    }
  });

  const totalSteps = 2; // Shared info + Role-specific info

  const handleNext = async (data: OnboardingFormData) => {
    setIsLoading(true);
    try {
      // Persist step 1 data
      const stepData = {
        display_name: data.display_name,
        bio: data.bio,
        social_links: data.social_links,
      };

      const { error } = await upsertUserProgress(stepData);
      if (error) throw new Error(error);

      setCurrentStep(2);
    } catch (error) {
      console.error('Error saving step 1:', error);
      toast({
        title: "Error",
        description: "Failed to save your progress. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async (data: OnboardingFormData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const updateData = {
        display_name: data.display_name,
        bio: data.bio,
        social_links: data.social_links,
        onboarding_completed: true,
        ...(userRole === 'gig_seeker' && {
          skills: data.skills,
          desired_gig_types: data.desired_gig_types,
          availability_status: data.availability_status,
          past_credits: data.past_credits,
          rate_range_min: data.rate_range_min,
          rate_range_max: data.rate_range_max,
        }),
        ...(userRole === 'gig_poster' && {
          company_name: data.company_name,
          typical_budget_min: data.typical_budget_min,
          typical_budget_max: data.typical_budget_max,
          timeline_expectations: data.timeline_expectations,
          nda_required: data.nda_required,
        }),
      };

      const { error } = await upsertUserProgress(updateData);
      if (error) throw new Error(error);

      // Refresh user data
      await refreshUser();

      toast({
        title: "Profile Complete!",
        description: "Welcome to BlackLabel.gg! Your profile has been set up successfully.",
      });

      onComplete();
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (currentStep === 1) {
    return (
      <OnboardingStep
        title="Let's set up your profile"
        description="Tell us about yourself"
        currentStep={currentStep}
        totalSteps={totalSteps}
      >
        <form onSubmit={form.handleSubmit(handleNext)} className="space-y-6">
          <SharedOnboardingFields form={form} />
          <div className="flex justify-end">
            <ButtonPrimary 
              type="submit" 
              size="lg"
              isLoading={isLoading}
            >
              Next
            </ButtonPrimary>
          </div>
        </form>
      </OnboardingStep>
    );
  }

  return (
    <OnboardingStep
      title={userRole === 'gig_seeker' ? "Tell us about your skills" : "Tell us about your projects"}
      description={userRole === 'gig_seeker' ? 
        "Help others understand what you bring to the table" : 
        "Help talent understand what you're looking for"
      }
      currentStep={currentStep}
      totalSteps={totalSteps}
    >
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {userRole === 'gig_seeker' ? (
          <GigSeekerFields form={form} />
        ) : (
          <GigPosterFields form={form} />
        )}
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
    </OnboardingStep>
  );
}
