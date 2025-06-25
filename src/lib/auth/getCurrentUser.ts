
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, UserId } from '@/types/auth';

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    // Get current session
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.user) {
      return null;
    }

    // Fetch user profile from users table
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();

    if (profileError || !userProfile) {
      console.error('Error fetching user profile:', profileError);
      return null;
    }

    return {
      id: userProfile.id as UserId,
      email: userProfile.email,
      role: userProfile.role,
      displayName: userProfile.display_name,
      bio: userProfile.bio || undefined,
      avatarUrl: userProfile.avatar_url || undefined,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
