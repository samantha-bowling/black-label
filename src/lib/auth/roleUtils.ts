
import { UserRole, AuthUser } from '@/types/auth';

export interface RoleCapabilities {
  canPostGigs: boolean;
  canApplyToGigs: boolean;
  canAccessAdmin: boolean;
  needsOnboarding: boolean;
  canManageInvites: boolean;
  hasFullAccess: boolean;
}

export function getRoleCapabilities(user: AuthUser | null): RoleCapabilities {
  if (!user) {
    return {
      canPostGigs: false,
      canApplyToGigs: false,
      canAccessAdmin: false,
      needsOnboarding: false,
      canManageInvites: false,
      hasFullAccess: false,
    };
  }

  const baseCapabilities = {
    canManageInvites: user.invites_remaining > 0,
    needsOnboarding: user.role ? !user.onboarding_completed : false,
  };

  switch (user.role) {
    case 'admin':
      return {
        ...baseCapabilities,
        canPostGigs: true,
        canApplyToGigs: true,
        canAccessAdmin: true,
        hasFullAccess: true,
      };
    
    case 'gig_poster':
      return {
        ...baseCapabilities,
        canPostGigs: true,
        canApplyToGigs: false,
        canAccessAdmin: false,
        hasFullAccess: false,
      };
    
    case 'gig_seeker':
      return {
        ...baseCapabilities,
        canPostGigs: false,
        canApplyToGigs: true,
        canAccessAdmin: false,
        hasFullAccess: false,
      };
    
    default:
      return {
        ...baseCapabilities,
        canPostGigs: false,
        canApplyToGigs: false,
        canAccessAdmin: false,
        hasFullAccess: false,
      };
  }
}

export function hasRole(user: AuthUser | null, role: UserRole): boolean {
  return user?.role === role;
}

export function isOnboardingComplete(user: AuthUser | null, role?: UserRole): boolean {
  if (!user) return false;
  
  const userRole = role || user.role;
  if (!userRole) return false;

  // Basic onboarding completion check
  if (!user.onboarding_completed) return false;

  // Role-specific completion checks
  switch (userRole) {
    case 'gig_poster':
      return !!(user.displayName && user.bio && user.company_name);
    case 'gig_seeker':
      return !!(user.displayName && user.bio);
    case 'admin':
      return !!(user.displayName);
    default:
      return false;
  }
}

export function getRequiredOnboardingSteps(user: AuthUser | null): string[] {
  if (!user || !user.role) return [];

  const missingSteps: string[] = [];

  // Check basic fields
  if (!user.displayName) missingSteps.push('Display name');
  if (!user.bio) missingSteps.push('Bio');

  // Role-specific checks
  if (user.role === 'gig_poster' && !user.company_name) {
    missingSteps.push('Company information');
  }

  return missingSteps;
}
