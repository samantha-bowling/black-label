
import { useSession } from './useSession';
import { UserRole } from '@/types/auth';

export function useUserRole() {
  const { user, role } = useSession();
  
  const hasRole = (targetRole: UserRole): boolean => {
    return user?.role === targetRole;
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
    return user && user.role ? !user.onboarding_completed : false;
  };

  return {
    userRole: role,
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
