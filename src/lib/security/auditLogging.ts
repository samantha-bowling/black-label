
import { supabase } from '@/integrations/supabase/client';
import { AuthUser } from '@/types/auth';

export type SecurityAction = 
  | 'user_signup'
  | 'user_signin'
  | 'user_signout'
  | 'profile_update'
  | 'role_change'
  | 'gig_created'
  | 'gig_updated'
  | 'gig_deleted'
  | 'application_created'
  | 'application_updated'
  | 'application_deleted'
  | 'invite_created'
  | 'invite_used'
  | 'contact_form_submitted'
  | 'suspicious_activity'
  | 'rate_limit_exceeded';

export type ResourceType = 
  | 'user'
  | 'gig'
  | 'application'
  | 'invite'
  | 'contact_message'
  | 'system';

export interface SecurityEventDetails {
  [key: string]: any;
  userAgent?: string;
  referrer?: string;
  timestamp: string;
  metadata?: Record<string, any>;
}

export const logSecurityEvent = async (
  user: AuthUser | null,
  action: SecurityAction,
  resourceType: ResourceType,
  resourceId?: string,
  details?: Partial<SecurityEventDetails>
): Promise<void> => {
  try {
    const eventDetails: SecurityEventDetails = {
      userAgent: navigator.userAgent,
      referrer: document.referrer,
      timestamp: new Date().toISOString(),
      ...details
    };

    const { error } = await supabase.rpc('log_security_event', {
      p_user_id: user?.id || null,
      p_action_type: action,
      p_resource_type: resourceType,
      p_resource_id: resourceId || null,
      p_details: eventDetails,
      p_user_agent: eventDetails.userAgent || null
    });

    if (error) {
      console.error('Failed to log security event:', error);
    }
  } catch (error) {
    console.error('Security logging error:', error);
  }
};

// Enhanced security logging hooks
export const useSecurityLogging = () => {
  const logAuthEvent = (
    user: AuthUser | null,
    action: 'user_signup' | 'user_signin' | 'user_signout',
    metadata?: Record<string, any>
  ) => {
    logSecurityEvent(user, action, 'user', user?.id, { metadata });
  };

  const logUserAction = (
    user: AuthUser,
    action: SecurityAction,
    resourceType: ResourceType,
    resourceId?: string,
    metadata?: Record<string, any>
  ) => {
    logSecurityEvent(user, action, resourceType, resourceId, { metadata });
  };

  const logSuspiciousActivity = (
    user: AuthUser | null,
    reason: string,
    metadata?: Record<string, any>
  ) => {
    logSecurityEvent(user, 'suspicious_activity', 'system', undefined, {
      metadata: { reason, ...metadata }
    });
  };

  return {
    logAuthEvent,
    logUserAction,
    logSuspiciousActivity
  };
};
