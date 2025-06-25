
import { UserRole } from '@/types/auth';
import { BaseOnboardingFlow } from './BaseOnboardingFlow';

interface PosterOnboardingFlowProps {
  onComplete: () => void;
}

export function PosterOnboardingFlow({ onComplete }: PosterOnboardingFlowProps) {
  return (
    <BaseOnboardingFlow 
      userRole={'gig_poster' as UserRole}
      onComplete={onComplete}
    />
  );
}
