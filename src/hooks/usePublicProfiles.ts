
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthUser, UserId } from '@/types/auth';

interface PublicProfile {
  id: UserId;
  displayName: string;
  bio?: string;
  avatarUrl?: string;
  role: string;
  skills?: string[];
  pastCredits?: string;
  socialLinks?: Record<string, string>;
}

export function usePublicProfiles() {
  const [profiles, setProfiles] = useState<PublicProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPublicProfiles = async (filters?: {
    role?: string;
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
          social_links
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
        role: profile.role,
        skills: profile.skills || undefined,
        pastCredits: profile.past_credits || undefined,
        socialLinks: (profile.social_links as Record<string, string>) || undefined,
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
