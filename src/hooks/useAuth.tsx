import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, SessionStatus, UserRole, UserId } from '@/types/auth';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  session: Session | null;
  user: AuthUser | null;
  sessionStatus: SessionStatus;
  signUp: (email: string, password: string, displayName: string, role?: UserRole) => Promise<{ error?: string }>;
  signIn: (email: string, password: string) => Promise<{ error?: string }>;
  signInWithLinkedIn: () => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        
        if (session?.user) {
          // Defer user profile fetch to avoid blocking auth state change
          setTimeout(async () => {
            try {
              const { data: userProfile, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', session.user.id)
                .single();

              if (userProfile && !error) {
                setUser({
                  id: userProfile.id as UserId,
                  email: session.user.email!, // Get email from session user object
                  role: userProfile.role,
                  displayName: userProfile.display_name,
                  bio: userProfile.bio || undefined,
                  avatarUrl: userProfile.avatar_url || undefined,
                  onboarding_completed: userProfile.onboarding_completed,
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
                });
              }
            } catch (error) {
              console.error('Error fetching user profile:', error);
            }
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

  const signUp = async (email: string, password: string, displayName: string, role: UserRole = 'gig_seeker') => {
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            role: role,
            display_name: displayName
          }
        }
      });

      if (error) {
        toast({
          title: "Sign Up Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error: error.message };
      }

      toast({
        title: "Sign Up Successful",
        description: "Please check your email to verify your account.",
      });

      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: "Sign Up Failed",
        description: errorMessage,
        variant: "destructive",
      });
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
        toast({
          title: "Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error: error.message };
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: "Sign In Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { error: errorMessage };
    }
  };

  const signInWithLinkedIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'linkedin_oidc',
        options: {
          redirectTo: `${window.location.origin}/`,
        }
      });

      if (error) {
        toast({
          title: "LinkedIn Sign In Failed",
          description: error.message,
          variant: "destructive",
        });
        return { error: error.message };
      }

      return {};
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast({
        title: "LinkedIn Sign In Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return { error: errorMessage };
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully.",
    });
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
      signInWithLinkedIn,
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
