
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, SessionStatus, UserRole, UserId } from '@/types/auth';
import { createAuthToasts } from '@/lib/auth/toastUtils';
import { enhancedSignUp, enhancedSignIn, EnhancedSignUpData, EnhancedSignInData } from '@/lib/auth/enhancedAuthUtils';
import { logSecurityEvent } from '@/lib/security/auditLogging';

interface AuthContextType {
  session: Session | null;
  user: AuthUser | null;
  sessionStatus: SessionStatus;
  signUp: (data: EnhancedSignUpData) => Promise<{ error?: string }>;
  signIn: (data: EnhancedSignInData) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const toasts = createAuthToasts();

  const fetchUserProfile = async (userId: string, email: string) => {
    try {
      const { data: userProfile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userProfile && !error) {
        setUser({
          id: userProfile.id as UserId,
          email: email,
          role: userProfile.role,
          displayName: userProfile.display_name,
          bio: userProfile.bio || undefined,
          avatarUrl: userProfile.avatar_url || undefined,
          onboarding_completed: userProfile.onboarding_completed,
          public_profile: userProfile.public_profile,
          skills: userProfile.skills || undefined,
          desired_gig_types: userProfile.desired_gig_types || undefined,
          availability_status: userProfile.availability_status || undefined,
          past_credits: userProfile.past_credits || undefined,
          rate_range_min: userProfile.rate_range_min || undefined,
          rate_range_max: userProfile.rate_range_max || undefined,
          company_name: userProfile.company_name || undefined,
          typical_budget_min: userProfile.typical_budget_min || undefined,
          typical_budget_max: userProfile.typical_budget_max || undefined,
          timeline_expectations: userProfile.timeline_expectations || undefined,
          social_links: (userProfile.social_links as Record<string, string>) || undefined,
          nda_required: userProfile.nda_required || undefined,
          invites_remaining: userProfile.invites_remaining,
          invited_by_user_id: userProfile.invited_by_user_id || undefined,
          invite_token_used: userProfile.invite_token_used || undefined,
          banner_image_url: userProfile.banner_image_url || undefined,
          banner_background_color: userProfile.banner_background_color || undefined,
          signature_quote: userProfile.signature_quote || undefined,
          expertise_signature: userProfile.expertise_signature || undefined,
          about_story: userProfile.about_story || undefined,
          smart_url_slug: userProfile.smart_url_slug || undefined,
          accepts_intros: userProfile.accepts_intros || undefined,
          requires_nda: userProfile.requires_nda || undefined,
          poster_type: userProfile.poster_type || undefined,
          location: userProfile.location || undefined,
          website_url: userProfile.website_url || undefined,
          linkedin_url: userProfile.linkedin_url || undefined,
          is_suspended: userProfile.is_suspended || undefined,
          suspension_expires_at: userProfile.suspension_expires_at || undefined,
          search_visibility_reduced: userProfile.search_visibility_reduced || undefined,
          messaging_restricted: userProfile.messaging_restricted || undefined,
          gig_posting_restricted: userProfile.gig_posting_restricted || undefined,
          moderation_notes: userProfile.moderation_notes || undefined,
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          // Defer user profile fetch to avoid blocking auth state change
          setTimeout(() => {
            fetchUserProfile(session.user.id, session.user.email!);
          }, 0);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (data: EnhancedSignUpData) => {
    const result = await enhancedSignUp(data);
    
    if (result.error) {
      toasts.signUpError(result.error);
      return { error: result.error };
    }

    toasts.signUpSuccess();
    return {};
  };

  const signIn = async (data: EnhancedSignInData) => {
    const result = await enhancedSignIn(data);
    
    if (result.error) {
      toasts.signInError(result.error);
      return { error: result.error };
    }

    toasts.signInSuccess();
    return {};
  };

  const signOut = async () => {
    if (user) {
      await logSecurityEvent(user, 'user_signout', 'user', user.id);
    }
    await supabase.auth.signOut();
    toasts.signOutSuccess();
  };

  const isExpired = session ? new Date(session.expires_at! * 1000) < new Date() : false;

  const sessionStatus: SessionStatus = {
    isLoading,
    isAuthenticated: !!session && !isExpired,
    isExpired,
    user,
    session,
  };

  return (
    <AuthContext.Provider value={{
      session,
      user,
      sessionStatus,
      signUp,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
