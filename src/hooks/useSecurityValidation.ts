
import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { validateUserSecurity, canUserPerformAction, validateSession } from '@/lib/security/authSecurity';
import { checkRateLimit, getClientIdentifier, RateLimitAction } from '@/lib/security/rateLimiting';
import { useSecurityLogging } from '@/lib/security/auditLogging';
import { toast } from 'sonner';

export function useSecurityValidation() {
  const { user } = useAuth();
  const { logSuspiciousActivity } = useSecurityLogging();
  const [isValidating, setIsValidating] = useState(false);

  const validateUserAction = useCallback(async (
    action: 'post_gig' | 'apply_to_gig' | 'send_message' | 'create_invite'
  ): Promise<boolean> => {
    setIsValidating(true);

    try {
      // Validate user security
      const userCheck = validateUserSecurity(user);
      if (!userCheck.isValid) {
        toast.error(userCheck.reasons[0]);
        return false;
      }

      // Check specific action permissions
      const actionCheck = canUserPerformAction(user, action);
      if (!actionCheck.isValid) {
        toast.error(actionCheck.reasons[0]);
        return false;
      }

      // Validate session
      const sessionCheck = await validateSession();
      if (!sessionCheck.isValid) {
        toast.error('Please sign in again to continue');
        return false;
      }

      return true;
    } catch (error) {
      console.error('Security validation error:', error);
      toast.error('Security validation failed');
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [user]);

  const validateWithRateLimit = useCallback(async (
    action: RateLimitAction,
    customIdentifier?: string
  ): Promise<boolean> => {
    setIsValidating(true);

    try {
      const identifier = customIdentifier || (user?.id || getClientIdentifier());
      const rateLimitCheck = await checkRateLimit(identifier, action);

      if (!rateLimitCheck.allowed) {
        toast.error(rateLimitCheck.reason);
        
        // Log rate limit violation
        if (user) {
          logSuspiciousActivity(user, 'Rate limit exceeded', {
            action,
            identifier: identifier.substring(0, 8) + '...' // Partial identifier for privacy
          });
        }
        
        return false;
      }

      return true;
    } catch (error) {
      console.error('Rate limit validation error:', error);
      toast.error('Request validation failed');
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [user, logSuspiciousActivity]);

  const validateSecureAction = useCallback(async (
    userAction: 'post_gig' | 'apply_to_gig' | 'send_message' | 'create_invite',
    rateLimitAction: RateLimitAction
  ): Promise<boolean> => {
    // Combine both validations
    const [userValid, rateLimitValid] = await Promise.all([
      validateUserAction(userAction),
      validateWithRateLimit(rateLimitAction)
    ]);

    return userValid && rateLimitValid;
  }, [validateUserAction, validateWithRateLimit]);

  return {
    validateUserAction,
    validateWithRateLimit,
    validateSecureAction,
    isValidating
  };
}
