
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, UserId } from '@/types/auth';
import { EnhancedProfileView } from '@/components/profile/EnhancedProfileView';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';

export default function PublicProfile() {
  const { slug } = useParams<{ slug: string }>();

  const { data: user, isLoading, error } = useQuery({
    queryKey: ['public-profile', slug],
    queryFn: async () => {
      if (!slug) throw new Error('No profile slug provided');

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('smart_url_slug', slug)
        .eq('public_profile', true)
        .eq('onboarding_completed', true)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Profile not found');

      return {
        id: data.id as UserId,
        email: '', // Don't expose email in public profiles
        role: data.role,
        displayName: data.display_name || 'Anonymous',
        bio: data.bio || '',
        avatarUrl: data.avatar_url || undefined,
        onboarding_completed: data.onboarding_completed,
        public_profile: data.public_profile,
        skills: data.skills || undefined,
        desired_gig_types: data.desired_gig_types || undefined,
        availability_status: data.availability_status || undefined,
        past_credits: data.past_credits || undefined,
        rate_range_min: data.rate_range_min || undefined,
        rate_range_max: data.rate_range_max || undefined,
        company_name: data.company_name || undefined,
        typical_budget_min: data.typical_budget_min || undefined,
        typical_budget_max: data.typical_budget_max || undefined,
        timeline_expectations: data.timeline_expectations || undefined,
        social_links: (data.social_links as Record<string, string>) || undefined,
        nda_required: data.nda_required || undefined,
        invites_remaining: data.invites_remaining,
        invited_by_user_id: data.invited_by_user_id || undefined,
        invite_token_used: data.invite_token_used || undefined,
        // Enhanced profile fields
        banner_image_url: data.banner_image_url || undefined,
        banner_background_color: data.banner_background_color || undefined,
        signature_quote: data.signature_quote || undefined,
        expertise_signature: data.expertise_signature || undefined,
        about_story: data.about_story || undefined,
        smart_url_slug: data.smart_url_slug || undefined,
        accepts_intros: data.accepts_intros || undefined,
        requires_nda: data.requires_nda || undefined,
      } as AuthUser;
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="h-64 bg-muted animate-pulse rounded-lg mb-8" />
          <div className="px-6 space-y-6">
            <div className="h-8 bg-muted animate-pulse rounded w-1/3" />
            <div className="h-32 bg-muted animate-pulse rounded" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-48 bg-muted animate-pulse rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-xl font-semibold mb-2">Profile Not Found</h1>
            <p className="text-muted-foreground">
              The profile you're looking for doesn't exist or isn't publicly available.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <EnhancedProfileView user={user} isOwner={false} />
    </div>
  );
}
