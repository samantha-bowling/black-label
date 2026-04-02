// @ts-nocheck

import { supabase } from '@/integrations/supabase/client';
import { AuthUser, UserId, ProjectShowcase } from '@/types/auth';

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

    // Safely parse project_showcase from jsonb
    let projectShowcase: ProjectShowcase[] = [];
    try {
      if (userProfile.project_showcase) {
        if (typeof userProfile.project_showcase === 'string') {
          projectShowcase = JSON.parse(userProfile.project_showcase);
        } else if (Array.isArray(userProfile.project_showcase)) {
          projectShowcase = userProfile.project_showcase as unknown as ProjectShowcase[];
        }
      }
    } catch (error) {
      console.error('Error parsing project_showcase:', error);
      projectShowcase = [];
    }

    return {
      id: userProfile.id as UserId,
      email: session.user.email!, // Get email from session user object
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
      years_experience: userProfile.years_experience || undefined,
      project_showcase: projectShowcase,
      // New profile form fields
      core_disciplines: userProfile.core_disciplines || undefined,
      project_types: userProfile.project_types || undefined,
      awards: userProfile.awards || undefined,
      available_for: userProfile.available_for || undefined,
      work_style: userProfile.work_style || undefined,
      rate_type: (userProfile.rate_type as 'hourly' | 'project' | 'salary') || undefined,
    };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}
