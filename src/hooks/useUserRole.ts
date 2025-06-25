
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

  const needsRoleSelection = (): boolean => {
    return !user?.role;
  };

  const needsOnboarding = (): boolean => {
    return user ? !user.onboarding_completed : false;
  };

  return {
    userRole: user?.role || null,
    hasRole,
    isGigPoster,
    isGigSeeker,
    isAdmin,
    canPostGigs,
    canApplyToGigs,
    needsRoleSelection,
    needsOnboarding,
  };
}
