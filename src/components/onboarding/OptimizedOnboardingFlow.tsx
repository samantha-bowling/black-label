import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { UserRole } from '@/types/auth';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Container, Card, Heading, Button, Progress, Text } from '@/components/ui/system';
import { ProfessionalFoundationStep } from './steps/ProfessionalFoundationStep';
import { ProfessionalShowcaseStep } from './steps/ProfessionalShowcaseStep';
import { WorkPrivacyPreferencesStep } from './steps/WorkPrivacyPreferencesStep';
import { PreQualificationStep } from './steps/PreQualificationStep';
import { toast } from 'sonner';

// Base schema for all users
const baseSchema = z.object({
  display_name: z.string().min(2, 'Display name is required').max(50, 'Display name too long'),
  bio: z.string().max(750, 'Bio must be under 750 characters').optional(),
  email: z.string().email('Valid email required').optional(),
  location: z.string().max(100, 'Location too long').optional(),
  website_url: z.string().url('Valid URL required').optional().or(z.literal('')),
  linkedin_url: z.string().url('Valid LinkedIn URL required').optional().or(z.literal('')),
  years_experience: z.number().min(0).max(50).optional(),
});

// Role-specific schemas
const gigSeekerSchema = baseSchema.extend({
  desired_gig_types: z.array(z.string()).optional(),
  availability_status: z.string().optional(),
  rate_range_min: z.number().min(0).optional(),
  rate_range_max: z.number().min(0).optional(),
  project_showcase: z.array(z.object({
    title: z.string(),
    description: z.string(),
    role: z.string(),
    year: z.number().optional(),
    technologies: z.array(z.string()).optional(),
    link: z.string().url().optional().or(z.literal(''))
  })).max(3).optional(),
  public_profile: z.boolean().default(false),
  accepts_intros: z.boolean().default(true),
});

const gigPosterSchema = baseSchema.extend({
  company_name: z.string().min(2, 'Company name required').max(100),
  poster_type: z.enum(['indie_dev', 'studio', 'agency', 'publisher', 'individual']),
  typical_budget_min: z.number().min(0).optional(),
  typical_budget_max: z.number().min(0).optional(),
  timeline_expectations: z.string().optional(),
  nda_required: z.boolean().default(false),
});

type OnboardingFormData = z.infer<typeof gigSeekerSchema> | z.infer<typeof gigPosterSchema>;

interface OptimizedOnboardingFlowProps {
  userRole: UserRole;
  onComplete: () => void;
  inviteToken?: string;
}

export function OptimizedOnboardingFlow({ 
  userRole, 
  onComplete, 
  inviteToken 
}: OptimizedOnboardingFlowProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [preQualified, setPreQualified] = useState(!inviteToken); // Skip pre-qual if no invite token
  
  // Determine schema and steps based on role
  const schema = userRole === 'gig_seeker' ? gigSeekerSchema : gigPosterSchema;
  const totalSteps = preQualified ? 3 : 4;
  
  const form = useForm<OnboardingFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      display_name: '',
      bio: '',
      public_profile: userRole === 'gig_seeker' ? false : true,
      accepts_intros: true,
      nda_required: false,
    },
    mode: 'onChange'
  });

  // Auto-save progress to localStorage
  const formData = form.watch();
  useEffect(() => {
    if (currentStep > 0) {
      localStorage.setItem('onboarding_progress', JSON.stringify({
        step: currentStep,
        data: formData,
        role: userRole
      }));
    }
  }, [formData, currentStep, userRole]);

  // Restore progress on mount
  useEffect(() => {
    const saved = localStorage.getItem('onboarding_progress');
    if (saved) {
      try {
        const { step, data, role } = JSON.parse(saved);
        if (role === userRole) {
          form.reset(data);
          setCurrentStep(step);
        }
      } catch (error) {
        console.error('Failed to restore onboarding progress:', error);
      }
    }
  }, [form, userRole]);

  // LinkedIn auto-enrichment (mock implementation)
  const enrichFromLinkedIn = useCallback(async () => {
    // In a real implementation, this would use LinkedIn API
    toast.info('LinkedIn enrichment would happen here in production');
  }, []);

  // Pre-qualification handler
  const handlePreQualification = useCallback((qualified: boolean, data?: any) => {
    if (qualified) {
      setPreQualified(true);
      setCurrentStep(1);
      if (data) {
        form.reset({ ...form.getValues(), ...data });
      }
    } else {
      toast.error('You do not meet the current requirements for this platform');
      navigate('/');
    }
  }, [form, navigate]);

  // Step navigation
  const goToNextStep = useCallback(async () => {
    const isValid = await form.trigger();
    if (isValid) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      }
    }
  }, [form, currentStep, totalSteps]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > (preQualified ? 1 : 0)) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep, preQualified]);

  // Final submission
  const handleSubmit = useCallback(async (data: OnboardingFormData) => {
    if (!user) return;

    setIsSubmitting(true);
    try {
      // Validate rate ranges for gig seekers
      if (userRole === 'gig_seeker' && 'rate_range_min' in data && 'rate_range_max' in data) {
        if (data.rate_range_min && data.rate_range_max && data.rate_range_min > data.rate_range_max) {
          form.setError('rate_range_max', { message: 'Maximum rate must be higher than minimum' });
          return;
        }
      }

      // Validate budget ranges for gig posters
      if (userRole === 'gig_poster' && 'typical_budget_min' in data && 'typical_budget_max' in data) {
        if (data.typical_budget_min && data.typical_budget_max && data.typical_budget_min > data.typical_budget_max) {
          form.setError('typical_budget_max', { message: 'Maximum budget must be higher than minimum' });
          return;
        }
      }

      const updateData = {
        ...data,
        onboarding_completed: true,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      // Clear saved progress
      localStorage.removeItem('onboarding_progress');

      toast.success(
        userRole === 'gig_seeker' 
          ? 'Welcome to the gaming talent network!' 
          : 'Your organization profile is ready!'
      );

      onComplete();
    } catch (error) {
      console.error('Onboarding submission error:', error);
      toast.error('Failed to complete onboarding. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [user, userRole, form, onComplete]);

  // Calculate progress
  const progressValue = preQualified 
    ? ((currentStep - 1) / (totalSteps - 1)) * 100
    : (currentStep / totalSteps) * 100;

  // Step content renderer
  const renderStepContent = () => {
    if (!preQualified) {
      return (
        <PreQualificationStep
          userRole={userRole}
          inviteToken={inviteToken}
          onQualified={handlePreQualification}
        />
      );
    }

    switch (currentStep) {
      case 1:
        return (
          <ProfessionalFoundationStep
            form={form}
            userRole={userRole}
            onLinkedInEnrich={enrichFromLinkedIn}
          />
        );
      case 2:
        return (
          <ProfessionalShowcaseStep
            form={form}
            userRole={userRole}
          />
        );
      case 3:
        return (
          <WorkPrivacyPreferencesStep
            form={form}
            userRole={userRole}
          />
        );
      default:
        return null;
    }
  };

  // Step info for display
  const getStepInfo = () => {
    if (!preQualified) {
      return {
        title: 'Welcome to BlackLabel.gg',
        description: 'Let\'s verify you\'re a good fit for our gaming talent community'
      };
    }

    const steps = {
      1: {
        title: userRole === 'gig_seeker' ? 'Professional Foundation' : 'Organization Details',
        description: userRole === 'gig_seeker' 
          ? 'Tell us about your background and expertise'
          : 'Share your company information and project focus'
      },
      2: {
        title: userRole === 'gig_seeker' ? 'Showcase Your Work' : 'Project Needs',
        description: userRole === 'gig_seeker'
          ? 'Highlight your best projects and achievements'
          : 'Define what kind of talent you\'re looking for'
      },
      3: {
        title: 'Work & Privacy Preferences',
        description: 'Set your availability and privacy settings'
      }
    };

    return steps[currentStep as keyof typeof steps] || { title: '', description: '' };
  };

  const stepInfo = getStepInfo();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface/50 to-background">
      <Container size="md" className="py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Progress Header */}
          {preQualified && (
            <div className="space-y-4">
              <Progress 
                value={progressValue} 
                showPercentage 
                variant="gaming"
                className="mb-6"
              />
              <div className="flex justify-between text-sm">
                <Text variant="secondary">
                  Step {currentStep} of {totalSteps - 1}
                </Text>
                <Text variant="secondary">
                  {Math.round(progressValue)}% Complete
                </Text>
              </div>
            </div>
          )}

          {/* Step Content */}
          <Card variant="gaming" padding="lg" className="space-y-6">
            <div className="text-center space-y-4">
              <Heading size="xl" variant="gradient">
                {stepInfo.title}
              </Heading>
              <Text size="lg" variant="secondary">
                {stepInfo.description}
              </Text>
            </div>

            {renderStepContent()}

            {/* Navigation */}
            {preQualified && (
              <div className="flex justify-between pt-6 border-t border-white/10">
                <Button
                  variant="ghost"
                  onClick={goToPreviousStep}
                  disabled={currentStep <= 1}
                >
                  Previous
                </Button>

                {currentStep < totalSteps ? (
                  <Button
                    variant="gaming"
                    onClick={goToNextStep}
                    disabled={!form.formState.isValid}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    variant="premium"
                    onClick={form.handleSubmit(handleSubmit)}
                    isLoading={isSubmitting}
                    disabled={!form.formState.isValid}
                  >
                    Complete Profile
                  </Button>
                )}
              </div>
            )}
          </Card>
        </div>
      </Container>
    </div>
  );
}