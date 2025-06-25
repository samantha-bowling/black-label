
import { UserRole } from '@/types/auth';

export const getSignUpTitle = (intendedRole: UserRole | null): string => {
  if (intendedRole === 'gig_seeker') {
    return 'Join as Gaming Talent';
  } else if (intendedRole === 'gig_poster') {
    return 'Join as Project Creator';
  }
  return 'Join the Elite';
};

export const getSignUpDescription = (intendedRole: UserRole | null): string => {
  if (intendedRole === 'gig_seeker') {
    return 'Complete your invite-only registration to access exclusive gaming opportunities';
  } else if (intendedRole === 'gig_poster') {
    return 'Set up your account to start posting gigs and finding talent';
  }
  return 'Enter the most exclusive gaming talent network';
};

export const getRedirectUrl = (): string => {
  return `${window.location.origin}/`;
};

export const shouldDisableSubmit = (
  isSignUp: boolean,
  intendedRole: UserRole | null,
  inviteValid: boolean | null,
  inviteToken: string
): boolean => {
  return isSignUp && 
         intendedRole === 'gig_seeker' && 
         (inviteValid === false || !inviteToken);
};
