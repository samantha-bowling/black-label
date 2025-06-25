
import { supabase } from '@/integrations/supabase/client';

export interface RateLimitConfig {
  maxAttempts: number;
  windowMinutes: number;
}

export const RATE_LIMIT_CONFIGS = {
  contact_form: { maxAttempts: 3, windowMinutes: 60 },
  signup: { maxAttempts: 5, windowMinutes: 60 },
  signin: { maxAttempts: 10, windowMinutes: 60 },
  invite_creation: { maxAttempts: 5, windowMinutes: 60 },
  gig_creation: { maxAttempts: 10, windowMinutes: 60 },
  application_creation: { maxAttempts: 20, windowMinutes: 60 },
} as const;

export type RateLimitAction = keyof typeof RATE_LIMIT_CONFIGS;

// Client-side rate limiting (basic protection)
const clientLimits = new Map<string, { count: number; resetTime: number }>();

export const checkClientRateLimit = (
  identifier: string,
  action: RateLimitAction
): boolean => {
  const config = RATE_LIMIT_CONFIGS[action];
  const key = `${identifier}:${action}`;
  const now = Date.now();
  const windowMs = config.windowMinutes * 60 * 1000;
  
  const current = clientLimits.get(key);
  
  if (!current || now > current.resetTime) {
    clientLimits.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (current.count >= config.maxAttempts) {
    return false;
  }
  
  current.count++;
  return true;
};

// Server-side rate limiting via Supabase function
export const checkServerRateLimit = async (
  identifier: string,
  action: RateLimitAction
): Promise<boolean> => {
  try {
    const config = RATE_LIMIT_CONFIGS[action];
    
    const { data, error } = await supabase.rpc('check_rate_limit', {
      p_identifier: identifier,
      p_action_type: action,
      p_max_attempts: config.maxAttempts,
      p_window_minutes: config.windowMinutes
    });
    
    if (error) {
      console.error('Rate limit check failed:', error);
      // Fail open for now, but log the error
      return true;
    }
    
    return data === true;
  } catch (error) {
    console.error('Rate limit check error:', error);
    return true; // Fail open
  }
};

// Get client identifier (IP would be better, but not available in browser)
export const getClientIdentifier = (): string => {
  // Use a combination of user agent and screen resolution as identifier
  const ua = navigator.userAgent;
  const screen = `${window.screen.width}x${window.screen.height}`;
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  return btoa(`${ua}:${screen}:${timezone}`).substring(0, 32);
};

// Combined rate limiting check
export const checkRateLimit = async (
  identifier: string,
  action: RateLimitAction
): Promise<{ allowed: boolean; reason?: string }> => {
  // First check client-side limit (immediate feedback)
  if (!checkClientRateLimit(identifier, action)) {
    return {
      allowed: false,
      reason: `Too many ${action.replace('_', ' ')} attempts. Please wait before trying again.`
    };
  }
  
  // Then check server-side limit (authoritative)
  const serverAllowed = await checkServerRateLimit(identifier, action);
  
  if (!serverAllowed) {
    return {
      allowed: false,
      reason: `Rate limit exceeded for ${action.replace('_', ' ')}. Please wait before trying again.`
    };
  }
  
  return { allowed: true };
};
