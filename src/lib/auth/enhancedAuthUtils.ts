
import { supabase } from '@/integrations/supabase/client';
import { validatePasswordStrength } from '@/lib/security/authSecurity';
import { validateAndSanitize, emailSchema, displayNameSchema, sanitizeEmail, sanitizeString } from '@/lib/security/validation';
import { checkRateLimit, getClientIdentifier } from '@/lib/security/rateLimiting';
import { logSecurityEvent } from '@/lib/security/auditLogging';
import { UserRole } from '@/types/auth';

export interface EnhancedSignUpData {
  email: string;
  password: string;
  displayName: string;
  role?: UserRole;
  inviteToken?: string;
}

export interface EnhancedSignInData {
  email: string;
  password: string;
}

export const enhancedSignUp = async (data: EnhancedSignUpData) => {
  try {
    // Rate limiting check
    const identifier = getClientIdentifier();
    const rateLimitCheck = await checkRateLimit(identifier, 'signup');
    
    if (!rateLimitCheck.allowed) {
      return { error: rateLimitCheck.reason };
    }

    // Input validation and sanitization
    const emailValidation = validateAndSanitize(emailSchema, data.email);
    if (!emailValidation.success) {
      return { error: emailValidation.errors[0] };
    }

    const displayNameValidation = validateAndSanitize(displayNameSchema, data.displayName);
    if (!displayNameValidation.success) {
      return { error: displayNameValidation.errors[0] };
    }

    // Password strength validation
    const passwordCheck = validatePasswordStrength(data.password);
    if (!passwordCheck.isValid) {
      return { error: passwordCheck.reasons[0] };
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeEmail(emailValidation.data);
    const sanitizedDisplayName = sanitizeString(displayNameValidation.data);

    // Check if email already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', sanitizedEmail)
      .maybeSingle();

    if (existingUser) {
      return { error: 'An account with this email already exists' };
    }

    // Validate invite token if provided
    if (data.inviteToken) {
      const { data: invite } = await supabase
        .from('invites')
        .select('*')
        .eq('token', data.inviteToken)
        .is('used_by_user_id', null)
        .gt('expires_at', new Date().toISOString())
        .maybeSingle();

      if (!invite) {
        return { error: 'Invalid or expired invite token' };
      }
    }

    // Perform sign up
    const redirectUrl = `${window.location.origin}/`;
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: sanitizedEmail,
      password: data.password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          display_name: sanitizedDisplayName,
          role: data.role || 'gig_seeker',
          invite_token: data.inviteToken
        }
      }
    });

    if (authError) {
      await logSecurityEvent(null, 'user_signup', 'user', undefined, {
        metadata: { error: authError.message, email: sanitizedEmail }
      });
      return { error: authError.message };
    }

    // Process invite token if provided and user was created
    if (authData.user && data.inviteToken) {
      const { error: inviteError } = await supabase.rpc('use_invite_token', {
        token_param: data.inviteToken,
        user_id_param: authData.user.id
      });

      if (inviteError) {
        console.error('Error processing invite token:', inviteError);
      }
    }

    await logSecurityEvent(null, 'user_signup', 'user', authData.user?.id, {
      metadata: { email: sanitizedEmail, role: data.role }
    });

    return { data: authData };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
    await logSecurityEvent(null, 'user_signup', 'user', undefined, {
      metadata: { error: errorMessage }
    });
    return { error: errorMessage };
  }
};

export const enhancedSignIn = async (data: EnhancedSignInData) => {
  try {
    // Rate limiting check
    const identifier = getClientIdentifier();
    const rateLimitCheck = await checkRateLimit(identifier, 'signin');
    
    if (!rateLimitCheck.allowed) {
      return { error: rateLimitCheck.reason };
    }

    // Input validation and sanitization
    const emailValidation = validateAndSanitize(emailSchema, data.email);
    if (!emailValidation.success) {
      return { error: emailValidation.errors[0] };
    }

    const sanitizedEmail = sanitizeEmail(emailValidation.data);

    // Perform sign in
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: sanitizedEmail,
      password: data.password,
    });

    if (authError) {
      await logSecurityEvent(null, 'user_signin', 'user', undefined, {
        metadata: { error: authError.message, email: sanitizedEmail }
      });
      return { error: authError.message };
    }

    // Check if user account is suspended
    if (authData.user) {
      const { data: userProfile } = await supabase
        .from('users')
        .select('is_suspended, suspension_expires_at')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (userProfile?.is_suspended) {
        const expiresAt = userProfile.suspension_expires_at ? new Date(userProfile.suspension_expires_at) : null;
        const isStillSuspended = !expiresAt || expiresAt > new Date();
        
        if (isStillSuspended) {
          await supabase.auth.signOut();
          return { error: 'Your account has been suspended. Please contact support.' };
        }
      }
    }

    await logSecurityEvent(authData.user ? { id: authData.user.id } as any : null, 'user_signin', 'user', authData.user?.id);

    return { data: authData };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
    await logSecurityEvent(null, 'user_signin', 'user', undefined, {
      metadata: { error: errorMessage }
    });
    return { error: errorMessage };
  }
};
