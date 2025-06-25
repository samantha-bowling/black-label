
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';
import { UserRole } from '@/types/auth';

interface UseOnboardingNavigationProps {
  targetRole?: UserRole;
  redirectPath?: string;
}

export function useOnboardingNavigation({ 
  targetRole, 
  redirectPath 
}: UseOnboardingNavigationProps = {}) {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    // If user has completed onboarding, don't interfere with navigation
    if (user.onboarding_completed) return;

    // If we have a target role and it matches, or no target role specified
    if (!targetRole || user.role === targetRole) {
      // User needs onboarding - determine where to send them
      if (user.role === 'gig_poster' && !redirectPath) {
        // Poster should go to post-gig for onboarding
        navigate('/post-a-gig');
      } else if (user.role === 'gig_seeker' && !redirectPath) {
        // Seeker should go to dashboard for onboarding
        navigate('/dashboard');
      } else if (redirectPath) {
        // Use custom redirect path
        navigate(redirectPath);
      }
    }
  }, [user, targetRole, redirectPath, navigate]);

  return {
    user,
    needsOnboarding: user && !user.onboarding_completed,
    userRole: user?.role
  };
}
