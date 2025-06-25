
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
    return 'Use your invite token to access exclusive gaming opportunities';
  } else if (intendedRole === 'gig_poster') {
    return 'Create your account to start posting gigs and finding talent';
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

export const getAuthModeFromUrl = (searchParams: URLSearchParams): 'signup' | 'signin' => {
  const mode = searchParams.get('mode');
  return mode === 'signin' ? 'signin' : 'signup';
};

export const getRoleFromUrl = (searchParams: URLSearchParams): UserRole | null => {
  const role = searchParams.get('role');
  const invite = searchParams.get('invite');
  
  if (invite) return 'gig_seeker';
  if (role === 'poster') return 'gig_poster';
  return 'gig_seeker'; // Default to seeker for invite flow
};
