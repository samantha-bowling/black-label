
import { UserRole } from '@/types/auth';
import { BaseOnboardingFlow } from './BaseOnboardingFlow';

interface OnboardingFlowProps {
  userRole: UserRole;
  onComplete: () => void;
}

export function OnboardingFlow({ userRole, onComplete }: OnboardingFlowProps) {
  return (
    <OptimizedOnboardingFlow 
      userRole={userRole}
      onComplete={onComplete}
    />
  );
}
