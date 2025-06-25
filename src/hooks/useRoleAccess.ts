
import { useAuth } from './useAuth';
import { getRoleCapabilities, hasRole, isOnboardingComplete, getRequiredOnboardingSteps } from '@/lib/auth/roleUtils';
import { UserRole } from '@/types/auth';

export function useRoleAccess() {
  const { user } = useAuth();
  const capabilities = getRoleCapabilities(user);

  return {
    // Core capabilities
    ...capabilities,
    
    // Role checks
    hasRole: (role: UserRole) => hasRole(user, role),
    isGigPoster: () => hasRole(user, 'gig_poster'),
    isGigSeeker: () => hasRole(user, 'gig_seeker'),
    isAdmin: () => hasRole(user, 'admin'),
    
    // Onboarding status
    isOnboardingComplete: (role?: UserRole) => isOnboardingComplete(user, role),
    getRequiredSteps: () => getRequiredOnboardingSteps(user),
    
    // Current user info
    userRole: user?.role || null,
    user,
  };
}
