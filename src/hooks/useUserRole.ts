
import { useAuth } from './useAuth';
import { UserRole } from '@/types/auth';

export function useUserRole() {
  const { user } = useAuth();
  
  const hasRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  const isGigPoster = (): boolean => hasRole('gig_poster');
  const isGigSeeker = (): boolean => hasRole('gig_seeker');
  const isAdmin = (): boolean => hasRole('admin');

  const canPostGigs = (): boolean => {
    return user?.role === 'gig_poster' || user?.role === 'admin';
  };

  const canApplyToGigs = (): boolean => {
    return user?.role === 'gig_seeker' || user?.role === 'admin';
  };

  const needsOnboarding = (): boolean => {
    // User needs onboarding if they have a role but haven't completed onboarding
    return user && user.role ? !user.onboarding_completed : false;
  };

  const isPosterOnboardingComplete = (): boolean => {
    // Check if poster has completed the essential fields
    if (!user || user.role !== 'gig_poster') return false;
    return !!(user.displayName && user.bio && user.onboarding_completed);
  };

  return {
    userRole: user?.role || null,
    hasRole,
    isGigPoster,
    isGigSeeker,
    isAdmin,
    canPostGigs,
    canApplyToGigs,
    needsOnboarding,
    isPosterOnboardingComplete,
  };
}
