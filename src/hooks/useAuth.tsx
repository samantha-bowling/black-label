import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, SessionStatus, UserRole, UserId } from '@/types/auth';
import { createAuthToasts } from '@/lib/auth/toastUtils';
import { getRedirectUrl } from '@/lib/auth/authUtils';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  session: Session | null;
  user: AuthUser | null;
  sessionStatus: SessionStatus;
  signUp: (email: string, password: string, displayName: string, role?: UserRole, inviteToken?: string) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const toasts = createAuthToasts();

  const ensureUserProfile = async (userId: string, email: string) => {
    try {
      const { data: result, error } = await supabase.rpc('ensure_user_profile', {
        user_id_param: userId,
        email_param: email
      });

      if (error) {
        console.error('Error ensuring user profile:', error);
        return false;
      }

      return result;
    } catch (error) {
      console.error('Error calling ensure_user_profile:', error);
      return false;
    }
  };

  const fetchUserProfile = async (userId: string, email: string, retryCount = 0) => {
    try {
      const { data: userProfile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (userProfile && !error) {
        // Extract social links properly
        const socialLinks = userProfile.social_links as Record<string, string> || {};
        
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
          social_links: socialLinks,
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
          website_url: socialLinks.website || userProfile.website_url || undefined,
          linkedin_url: socialLinks.linkedin || userProfile.linkedin_url || undefined,
          years_experience: userProfile.years_experience || undefined,
          project_showcase: userProfile.project_showcase || undefined,
          // New profile form fields
          core_disciplines: userProfile.core_disciplines || undefined,
          project_types: userProfile.project_types || undefined,
          awards: userProfile.awards || undefined,
          available_for: userProfile.available_for || undefined,
          work_style: userProfile.work_style || undefined,
          rate_type: userProfile.rate_type || undefined,
        });
        return true;
      } else if (retryCount < 3) {
        // Profile doesn't exist, try to create it
        console.log(`Profile not found, attempting to create (attempt ${retryCount + 1})`);
        const profileCreated = await ensureUserProfile(userId, email);
        
        if (profileCreated) {
          // Retry fetching after creating profile
          setTimeout(() => {
            fetchUserProfile(userId, email, retryCount + 1);
          }, 1000 * (retryCount + 1));
        } else {
          console.error('Failed to create user profile');
        }
      } else {
        console.error('Failed to fetch or create user profile after retries:', error);
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      if (retryCount < 3) {
        setTimeout(() => {
          fetchUserProfile(userId, email, retryCount + 1);
        }, 1000 * (retryCount + 1));
      }
    }
    return false;
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id, session.user.email!);
          }, 0);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (!session) {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, displayName: string, role: UserRole = 'gig_seeker', inviteToken?: string) => {
    try {
      const redirectUrl = getRedirectUrl();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            role: role,
            display_name: displayName,
            invite_token: inviteToken
          }
        }
      });

      if (error) {
        toasts.signUpError(error.message);
        return { error: error.message };
      }

      toasts.signUpSuccess();
      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toasts.signUpError(errorMessage);
      return { error: errorMessage };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toasts.signInError(error.message);
        return { error: error.message };
      }

      toasts.signInSuccess();
      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toasts.signInError(errorMessage);
      return { error: errorMessage };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toasts.signOutSuccess();
    // Redirect to landing page after sign out
    window.location.href = '/';
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
