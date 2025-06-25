
import { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { SessionStatus, AuthUser, UserId } from '@/types/auth';

export function useSessionStatus(): SessionStatus {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
                  email: userProfile.email,
                  role: userProfile.role,
                  displayName: userProfile.display_name,
                  bio: userProfile.bio || undefined,
                  avatarUrl: userProfile.avatar_url || undefined,
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

  const isExpired = session ? new Date(session.expires_at! * 1000) < new Date() : false;

  return {
    isLoading,
    isAuthenticated: !!session && !isExpired,
    isExpired,
    user,
    session,
  };
}
