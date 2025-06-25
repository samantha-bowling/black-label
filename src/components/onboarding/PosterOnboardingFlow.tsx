
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { PosterType } from '@/types/auth';
import { OnboardingStep } from './OnboardingStep';
import { PosterOnboardingFields } from './PosterOnboardingFields';
import { ButtonPrimary } from '@/components/ui/primitives';

interface PosterOnboardingData {
  display_name: string;
  bio?: string;
  company_name?: string;
  location?: string;
  website_url?: string;
  linkedin_url?: string;  
  poster_type?: PosterType;
}

interface PosterOnboardingFlowProps {
  onComplete: () => void;
}

export function PosterOnboardingFlow({ onComplete }: PosterOnboardingFlowProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<PosterOnboardingData>({
    defaultValues: {
      display_name: user?.displayName || '',
      bio: user?.bio || '',
      company_name: user?.company_name || '',
      location: user?.location || '',
      website_url: user?.website_url || '',
      linkedin_url: user?.linkedin_url || '',
    }
  });

  const handleSubmit = async (data: PosterOnboardingData) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const updateData = {
        display_name: data.display_name,
        bio: data.bio,
        company_name: data.company_name,
        location: data.location,
        website_url: data.website_url,
        linkedin_url: data.linkedin_url,
        poster_type: data.poster_type,
        onboarding_completed: true,
      };

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Welcome to BLACKLABEL.gg!",
        description: "Your poster profile has been set up successfully.",
      });

      onComplete();
    } catch (error) {
      console.error('Error completing poster onboarding:', error);
      toast({
        title: "Error",
        description: "Failed to save your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <OnboardingStep
      title="Set up your poster profile"
      description="Tell us about your hiring needs and organization"
      currentStep={1}
      totalSteps={1}
    >
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <PosterOnboardingFields form={form} />
        
        <div className="flex justify-end">
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
