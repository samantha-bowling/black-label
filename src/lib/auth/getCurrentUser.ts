
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
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
