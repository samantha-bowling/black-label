import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { UserRole } from '@/types/auth';
import { OnboardingStep } from './OnboardingStep';
import { SharedOnboardingFields } from './SharedOnboardingFields';
import { ProfileDNATagsStep } from './ProfileDNATagsStep';
import { GigSeekerFields } from './GigSeekerFields';
import { GigPosterFields } from './GigPosterFields';
import { PrivacyProfileSettingsStep } from './PrivacyProfileSettingsStep';
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
  // Profile DNA tags (replacing legacy skills)
  profile_tags?: {
    core_disciplines: string[];
    specialty_skills: string[];
    project_types: string[];
  };
  // Gig Seeker specific (updated)
  desired_gig_types?: string[];
  availability_status?: string;
  past_credits?: string;
  rate_range_min?: number;
  rate_range_max?: number;
  rate_visibility?: 'private' | 'verified_only' | 'public';
  // Gig Poster specific
  company_name?: string;
  typical_budget_min?: number;
  typical_budget_max?: number;
  timeline_expectations?: string;
  nda_required?: boolean;
  public_profile?: boolean;
  accepts_intros?: boolean;
}

export function OnboardingFlow({ userRole, onComplete }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const form = useForm<OnboardingFormData>({
    defaultValues: {
      display_name: user?.displayName || '',
      bio: user?.bio || '',
      social_links: user?.social_links || {},
      profile_tags: {
        core_disciplines: [],
        specialty_skills: [],
        project_types: [],
      },
      desired_gig_types: user?.desired_gig_types || [],
      availability_status: user?.availability_status || '',
      past_credits: user?.past_credits || '',
      rate_range_min: user?.rate_range_min,
      rate_range_max: user?.rate_range_max,
      rate_visibility: 'private',
      public_profile: user?.public_profile || false,
      accepts_intros: user?.accepts_intros !== false, // Default to true
      company_name: user?.company_name || '',
      typical_budget_min: user?.typical_budget_min,
      typical_budget_max: user?.typical_budget_max,
      timeline_expectations: user?.timeline_expectations || '',
      nda_required: user?.nda_required || false,
    }
  });

  // Update total steps based on user role
  const totalSteps = userRole === 'gig_seeker' ? 4 : 3; // Basic + DNA Tags + Professional + Privacy for seekers

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
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
      // Update user profile
      const updateData = {
        display_name: data.display_name,
        bio: data.bio,
        social_links: data.social_links,
        onboarding_completed: true,
        ...(userRole === 'gig_seeker' && {
          desired_gig_types: data.desired_gig_types,
          availability_status: data.availability_status,
          past_credits: data.past_credits,
          rate_range_min: data.rate_range_min,
          rate_range_max: data.rate_range_max,
          public_profile: data.public_profile,
          accepts_intros: data.accepts_intros,
          // Note: rate_visibility will be handled in a future update
        }),
        ...(userRole === 'gig_poster' && {
          company_name: data.company_name,
          typical_budget_min: data.typical_budget_min,
          typical_budget_max: data.typical_budget_max,
          timeline_expectations: data.timeline_expectations,
          nda_required: data.nda_required,
        }),
      };

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

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

  // Step 1: Basic Profile Information
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
            <ButtonPrimary type="submit" size="lg">
              Next
            </ButtonPrimary>
          </div>
        </form>
      </OnboardingStep>
    );
  }

  // Step 2: Profile DNA Tags (for both roles)
  if (currentStep === 2) {
    return (
      <OnboardingStep
        title="Define your professional DNA"
        description="Help others understand your expertise and specialization"
        currentStep={currentStep}
        totalSteps={totalSteps}
      >
        <ProfileDNATagsStep 
          userId={user?.id || ''}
          onNext={handleNext}
          onBack={handleBack}
        />
      </OnboardingStep>
    );
  }

  // Step 3: Role-specific information
  if (currentStep === 3) {
    return (
      <OnboardingStep
        title={userRole === 'gig_seeker' ? "Professional story & experience" : "Tell us about your projects"}
        description={userRole === 'gig_seeker' ? 
          "Share your accomplishments and what makes you unique" : 
          "Help talent understand what you're looking for"
        }
        currentStep={currentStep}
        totalSteps={totalSteps}
      >
        <form onSubmit={form.handleSubmit(userRole === 'gig_seeker' ? handleNext : handleSubmit)} className="space-y-6">
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
              {userRole === 'gig_seeker' ? 'Next' : 'Complete Setup'}
            </ButtonPrimary>
          </div>
        </form>
      </OnboardingStep>
    );
  }

  // Step 4: Privacy & Profile Settings (Gig Seekers only)
  if (currentStep === 4 && userRole === 'gig_seeker') {
    return (
      <OnboardingStep
        title="Privacy & profile settings"
        description="Control how your profile appears to others"
        currentStep={currentStep}
        totalSteps={totalSteps}
      >
        <PrivacyProfileSettingsStep
          form={form}
          onNext={handleNext}
          onBack={handleBack}
          onSubmit={() => form.handleSubmit(handleSubmit)()}
          isLoading={isLoading}
        />
      </OnboardingStep>
    );
  }

  return null;
}
