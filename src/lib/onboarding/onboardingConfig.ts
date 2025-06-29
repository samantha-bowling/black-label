
import { UserRole } from '@/types/auth';

export interface OnboardingStepConfig {
  id: string;
  title: string;
  description: string;
  component: 'shared' | 'profile-dna' | 'project-showcase' | 'gig-seeker' | 'gig-poster' | 'privacy';
}

export interface OnboardingFlowConfig {
  role: UserRole;
  steps: OnboardingStepConfig[];
  totalSteps: number;
}

export const ONBOARDING_CONFIGS: Record<UserRole, OnboardingFlowConfig> = {
  gig_seeker: {
    role: 'gig_seeker',
    totalSteps: 5, // Updated from 4 to 5
    steps: [
      {
        id: 'basic',
        title: "Let's set up your profile",
        description: "Tell us about yourself",
        component: 'shared'
      },
      {
        id: 'dna',
        title: "Define your professional DNA",
        description: "Help others understand your expertise and specialization",
        component: 'profile-dna'
      },
      {
        id: 'showcase',
        title: "Showcase your best work",
        description: "Highlight up to 3 projects that demonstrate your expertise",
        component: 'project-showcase'
      },
      {
        id: 'professional',
        title: "Professional story & experience",
        description: "Share your accomplishments and what makes you unique",
        component: 'gig-seeker'
      },
      {
        id: 'privacy',
        title: "Privacy & profile settings",
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
        title: "Let's set up your profile",
        description: "Tell us about yourself",
        component: 'shared'
      },
      {
        id: 'dna',
        title: "Define your professional DNA",
        description: "Help others understand your expertise and specialization",
        component: 'profile-dna'
      },
      {
        id: 'organization',
        title: "Tell us about your projects",
        description: "Help talent understand what you're looking for",
        component: 'gig-poster'
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
        component: 'shared'
      }
    ]
  }
};

export function getOnboardingConfig(role: UserRole): OnboardingFlowConfig {
  return ONBOARDING_CONFIGS[role];
}
