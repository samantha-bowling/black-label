// @ts-nocheck

import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, UserId, UserRole } from '@/types/auth';

interface PublicProfile {
  id: UserId;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  role: UserRole;
  skills?: string[];
  pastCredits?: string;
  socialLinks?: Record<string, string>;
  inviter?: {
    id: string;
    displayName: string;
    avatarUrl?: string;
    smartUrlSlug?: string;
    publicProfile: boolean;
  } | null;
}

export function usePublicProfiles() {
  const [profiles, setProfiles] = useState<PublicProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPublicProfiles = async (filters?: {
    role?: UserRole;
    skills?: string[];
    limit?: number;
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('users')
        .select(`
          id,
          display_name,
          bio,
          avatar_url,
          role,
          skills,
          past_credits,
          social_links,
          invited_by_user_id,
          inviter:invited_by_user_id(
            id,
            display_name,
            avatar_url,
            smart_url_slug,
            public_profile
          )
        `)
        .eq('public_profile', true)
        .eq('onboarding_completed', true)
        .not('role', 'is', null);

      if (filters?.role) {
        query = query.eq('role', filters.role);
      }

      if (filters?.skills && filters.skills.length > 0) {
        query = query.overlaps('skills', filters.skills);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) {
        setError(error.message);
        return;
      }

      const publicProfiles: PublicProfile[] = data.map(profile => ({
        id: profile.id as UserId,
        displayName: profile.display_name || 'Anonymous',
        bio: profile.bio || undefined,
        avatarUrl: profile.avatar_url || undefined,
        role: profile.role as UserRole,
        skills: profile.skills || undefined,
        pastCredits: profile.past_credits || undefined,
        socialLinks: (profile.social_links as Record<string, string>) || undefined,
        inviter: profile.inviter ? {
          id: profile.inviter.id,
          displayName: profile.inviter.display_name || 'Anonymous',
          avatarUrl: profile.inviter.avatar_url || undefined,
          smartUrlSlug: profile.inviter.smart_url_slug || undefined,
          publicProfile: profile.inviter.public_profile || false,
        } : null,
      }));

      setProfiles(publicProfiles);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch public profiles');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPublicProfiles();
  }, []);

  return {
    profiles,
    isLoading,
    error,
    refetch: fetchPublicProfiles,
  };
}
