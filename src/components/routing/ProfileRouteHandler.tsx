
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, UserId } from '@/types/auth';
import { useCaseStudies } from '@/hooks/useCaseStudies';
import { EditorialProfileView } from '@/components/profile/editorial/EditorialProfileView';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { validateSlug } from '@/lib/routing/slugValidation';

interface InviterInfo {
  id: string;
  displayName: string;
  avatarUrl?: string;
  smartUrlSlug?: string;
  publicProfile: boolean;
}

export function ProfileRouteHandler() {
  const { slug } = useParams<{ slug: string }>();

  // Validate slug format first
  const slugValidation = validateSlug(slug || '');
  
  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ['profile-by-slug', slug],
    queryFn: async () => {
      if (!slug || !slugValidation.isValid) {
        throw new Error('Invalid profile URL');
      }

      // First check if profile exists
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('smart_url_slug', slug)
        .eq('public_profile', true)
        .eq('onboarding_completed', true)
        .single();

      if (userError) throw userError;
      if (!userData) throw new Error('Profile not found');

      // If user was invited by someone, fetch inviter info
      let inviterInfo: InviterInfo | null = null;
      if (userData.invited_by_user_id) {
        const { data: inviterData, error: inviterError } = await supabase
          .from('users')
          .select('id, display_name, avatar_url, smart_url_slug, public_profile')
          .eq('id', userData.invited_by_user_id)
          .single();

        if (!inviterError && inviterData) {
          inviterInfo = {
            id: inviterData.id,
            displayName: inviterData.display_name || 'Anonymous',
            avatarUrl: inviterData.avatar_url || undefined,
            smartUrlSlug: inviterData.smart_url_slug || undefined,
            publicProfile: inviterData.public_profile || false,
          };
        }
      }

      // Safely parse social_links from Json type
      const socialLinks = userData.social_links as Record<string, string> | null;

      const user: AuthUser = {
        id: userData.id as UserId,
        email: '', // Don't expose email in public profiles
        role: userData.role,
        displayName: userData.display_name || 'Anonymous',
        bio: userData.bio || '',
        avatarUrl: userData.avatar_url || undefined,
        onboarding_completed: userData.onboarding_completed,
        public_profile: userData.public_profile,
        skills: userData.skills || undefined,
        desired_gig_types: userData.desired_gig_types || undefined,
        availability_status: userData.availability_status || undefined,
        past_credits: userData.past_credits || undefined,
        rate_range_min: userData.rate_range_min || undefined,
        rate_range_max: userData.rate_range_max || undefined,
        company_name: userData.company_name || undefined,
        typical_budget_min: userData.typical_budget_min || undefined,
        typical_budget_max: userData.typical_budget_max || undefined,
        timeline_expectations: userData.timeline_expectations || undefined,
        social_links: socialLinks || undefined,
        nda_required: userData.nda_required || undefined,
        invites_remaining: userData.invites_remaining,
        invited_by_user_id: userData.invited_by_user_id || undefined,
        invite_token_used: userData.invite_token_used || undefined,
        // Enhanced profile fields
        banner_image_url: userData.banner_image_url || undefined,
        banner_background_color: userData.banner_background_color || undefined,
        signature_quote: userData.signature_quote || undefined,
        expertise_signature: userData.expertise_signature || undefined,
        about_story: userData.about_story || undefined,
        smart_url_slug: userData.smart_url_slug || undefined,
        accepts_intros: userData.accepts_intros || undefined,
        requires_nda: userData.requires_nda || undefined,
        poster_type: userData.poster_type || undefined,
        location: userData.location || undefined,
        website_url: socialLinks?.website || userData.website_url || undefined,
        linkedin_url: socialLinks?.linkedin || userData.linkedin_url || undefined,
      };

      return { user, inviter: inviterInfo };
    },
    enabled: !!slug && slugValidation.isValid,
  });

  // Fetch case studies for the user
  const { caseStudies } = useCaseStudies(profileData?.user?.id);

  if (!slug || !slugValidation.isValid) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md bg-white/5 border-white/10">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-white/50 mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2 text-white">Invalid Profile URL</h1>
            <p className="text-white/60">
              {slugValidation.error || 'The profile URL format is invalid.'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="animate-pulse">
          {/* Hero Loading */}
          <div className="h-[60vh] bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800" />
          
          {/* Content Loading */}
          <div className="max-w-6xl mx-auto px-6 py-16">
            <div className="grid md:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-32 bg-white/5 rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profileData?.user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md bg-white/5 border-white/10">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-white/50 mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2 text-white">Profile Not Found</h1>
            <p className="text-white/60">
              The profile you're looking for doesn't exist or isn't publicly available.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <EditorialProfileView 
      user={profileData.user} 
      caseStudies={caseStudies}
      inviter={profileData.inviter}
    />
  );
}
