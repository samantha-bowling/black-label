
import { AuthUser } from '@/types/auth';
import { supabase } from '@/integrations/supabase/client';

export interface SecurityCheck {
  isValid: boolean;
  reasons: string[];
}

// Enhanced user security validation
export const validateUserSecurity = (user: AuthUser | null): SecurityCheck => {
  const reasons: string[] = [];

  if (!user) {
    reasons.push('User not authenticated');
    return { isValid: false, reasons };
  }

  if (user.is_suspended) {
    const expiresAt = user.suspension_expires_at ? new Date(user.suspension_expires_at) : null;
    if (!expiresAt || expiresAt > new Date()) {
      reasons.push('Account is suspended');
    }
  }

  return {
    isValid: reasons.length === 0,
    reasons
  };
};

// Check if user can perform specific actions
export const canUserPerformAction = (
  user: AuthUser | null,
  action: 'post_gig' | 'apply_to_gig' | 'send_message' | 'create_invite'
): SecurityCheck => {
  const baseCheck = validateUserSecurity(user);
  if (!baseCheck.isValid) {
    return baseCheck;
  }

  const reasons: string[] = [];

  if (!user) {
    reasons.push('Authentication required');
    return { isValid: false, reasons };
  }

  // Check onboarding completion
  if (!user.onboarding_completed) {
    reasons.push('Profile onboarding must be completed');
  }

  // Check role-specific restrictions
  switch (action) {
    case 'post_gig':
      if (!['gig_poster', 'admin'].includes(user.role)) {
        reasons.push('Gig posting requires poster role');
      }
      if (user.gig_posting_restricted) {
        reasons.push('Gig posting is restricted for this account');
      }
      break;

    case 'apply_to_gig':
      if (!['gig_seeker', 'admin'].includes(user.role)) {
        reasons.push('Gig applications require seeker role');
      }
      break;

    case 'send_message':
      if (user.messaging_restricted) {
        reasons.push('Messaging is restricted for this account');
      }
      break;

    case 'create_invite':
      if (user.invites_remaining <= 0 && user.role !== 'admin') {
        reasons.push('No remaining invites available');
      }
      break;
  }

  return {
    isValid: reasons.length === 0,
    reasons
  };
};

// Session security validation
export const validateSession = async (): Promise<SecurityCheck> => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      return { isValid: false, reasons: ['Session validation failed'] };
    }

    if (!session) {
      return { isValid: false, reasons: ['No active session'] };
    }

    // Check if session is expired
    const expiresAt = new Date(session.expires_at! * 1000);
    if (expiresAt <= new Date()) {
      return { isValid: false, reasons: ['Session expired'] };
    }

    // Check if session expires soon (within 5 minutes)
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
    if (expiresAt <= fiveMinutesFromNow) {
      // Attempt to refresh the session
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        return { isValid: false, reasons: ['Session refresh failed'] };
      }
    }

    return { isValid: true, reasons: [] };
  } catch (error) {
    return { isValid: false, reasons: ['Session validation error'] };
  }
};

// Password strength validation
export const validatePasswordStrength = (password: string): SecurityCheck => {
  const reasons: string[] = [];

  if (password.length < 8) {
    reasons.push('Password must be at least 8 characters long');
  }

  if (password.length > 128) {
    reasons.push('Password must be less than 128 characters');
  }

  if (!/[a-z]/.test(password)) {
    reasons.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    reasons.push('Password must contain at least one uppercase letter');
  }

  if (!/\d/.test(password)) {
    reasons.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>?]/.test(password)) {
    reasons.push('Password should contain at least one special character');
  }

  // Check for common weak passwords
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey'
  ];

  if (commonPasswords.includes(password.toLowerCase())) {
    reasons.push('Password is too common, please choose a stronger password');
  }

  return {
    isValid: reasons.length === 0,
    reasons
  };
};
