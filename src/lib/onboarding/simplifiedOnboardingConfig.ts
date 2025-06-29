
import { UserRole } from '@/types/auth';

export interface SimplifiedOnboardingStepConfig {
  id: string;
  title: string;
  description: string;
  component: 'basic' | 'dna' | 'privacy';
}

export interface SimplifiedOnboardingFlowConfig {
  role: UserRole;
  steps: SimplifiedOnboardingStepConfig[];
  totalSteps: number;
}

export const SIMPLIFIED_ONBOARDING_CONFIGS: Record<UserRole, SimplifiedOnboardingFlowConfig> = {
  gig_seeker: {
    role: 'gig_seeker',
    totalSteps: 3,
    steps: [
      {
        id: 'basic',
        title: "Welcome! Let's get started",
        description: "Tell us your name and a bit about yourself",
        component: 'basic'
      },
      {
        id: 'dna',
        title: "What's your professional DNA?",
        description: "Help others understand your expertise",
        component: 'dna'
      },
      {
        id: 'privacy',
        title: "Privacy & visibility settings",
        description: "Control how your profile appears to others",
        component: 'privacy'
      }
    ]
  },
  gig_poster: {
    role: 'gig_poster',
    totalSteps: 3,
    steps: [
      {
        id: 'basic',
        title: "Welcome! Let's get started",
        description: "Tell us about yourself and your organization",
        component: 'basic'
      },
      {
        id: 'dna',
        title: "What kind of projects do you work on?",
        description: "Help talent understand what you're looking for",
        component: 'dna'
      },
      {
        id: 'privacy',
        title: "Privacy & visibility settings",
        description: "Control how your profile appears to others",
        component: 'privacy'
      }
    ]
  },
  admin: {
    role: 'admin',
    totalSteps: 1,
    steps: [
      {
        id: 'basic',
        title: "Admin Setup",
        description: "Configure your administrator profile",
        component: 'basic'
      }
    ]
  }
};

export function getSimplifiedOnboardingConfig(role: UserRole): SimplifiedOnboardingFlowConfig {
  return SIMPLIFIED_ONBOARDING_CONFIGS[role];
}
