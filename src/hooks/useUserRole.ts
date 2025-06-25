
import { useAuth } from './useAuth';
import { UserRole } from '@/types/auth';
import { getRoleCapabilities, hasRole, isOnboardingComplete } from '@/lib/auth/roleUtils';

export function useUserRole() {
  const { user } = useAuth();
  const capabilities = getRoleCapabilities(user);
  
  const needsOnboarding = (): boolean => {
    // User needs onboarding if they have a role but haven't completed onboarding
    return user && user.role ? !user.onboarding_completed : false;
  };

  const isPosterOnboardingComplete = (): boolean => {
    // Check if poster has completed the essential fields
    return isOnboardingComplete(user, 'gig_poster');
  };

  return {
    userRole: user?.role || null,
    hasRole: (role: UserRole) => hasRole(user, role),
    isGigPoster: () => hasRole(user, 'gig_poster'),
    isGigSeeker: () => hasRole(user, 'gig_seeker'),
    isAdmin: () => hasRole(user, 'admin'),
    canPostGigs: () => capabilities.canPostGigs,
    canApplyToGigs: () => capabilities.canApplyToGigs,
    needsOnboarding,
    isPosterOnboardingComplete,
  };
}
