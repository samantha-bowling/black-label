// @ts-nocheck

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { FeatureFlag } from '@/types/auth';

interface FeatureFlags {
  messaging: boolean;
  reviews: boolean;
  milestone_tracking: boolean;
  application_filters: boolean;
  enhanced_profiles: boolean;
}

export function useFeatureFlags() {
  const { data: flags, isLoading, error } = useQuery({
    queryKey: ['feature-flags'],
    queryFn: async (): Promise<FeatureFlag[]> => {
      const { data, error } = await supabase
        .from('feature_flags')
        .select('*');

      if (error) throw error;
      return data || [];
    },
  });

  const featureFlags: FeatureFlags = {
    messaging: flags?.find(f => f.flag_name === 'messaging')?.enabled ?? false,
    reviews: flags?.find(f => f.flag_name === 'reviews')?.enabled ?? false,
    milestone_tracking: flags?.find(f => f.flag_name === 'milestone_tracking')?.enabled ?? false,
    application_filters: flags?.find(f => f.flag_name === 'application_filters')?.enabled ?? false,
    enhanced_profiles: flags?.find(f => f.flag_name === 'enhanced_profiles')?.enabled ?? false,
  };

  const isEnabled = (flagName: keyof FeatureFlags): boolean => {
    return featureFlags[flagName];
  };

  return {
    flags: featureFlags,
    isEnabled,
    isLoading,
    error,
  };
}
