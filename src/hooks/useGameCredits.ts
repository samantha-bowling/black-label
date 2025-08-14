import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface GameCredit {
  id: string;
  user_id: string;
  game_title: string;
  role: string;
  company_studio?: string;
  platform?: string[];
  release_year?: number;
  description?: string;
  is_featured: boolean;
  metacritic_score?: number;
  sales_figures?: string;
  awards_recognition?: string[];
  external_link?: string;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const PLATFORMS = [
  'PC',
  'PlayStation 5',
  'PlayStation 4',
  'Xbox Series X/S',
  'Xbox One',
  'Nintendo Switch',
  'iOS',
  'Android',
  'Web',
  'VR',
  'Steam',
  'Epic Games Store',
  'Other'
] as const;

export function useGameCredits(userId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const targetUserId = userId || user?.id;

  const { data: credits = [], isLoading, error } = useQuery({
    queryKey: ['game-credits', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return [];
      
      const { data, error } = await supabase
        .from('game_credits')
        .select('*')
        .eq('user_id', targetUserId)
        .order('is_featured', { ascending: false })
        .order('release_year', { ascending: false })
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as GameCredit[];
    },
    enabled: !!targetUserId,
  });

  const addCredit = useMutation({
    mutationFn: async (credit: Omit<GameCredit, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('game_credits')
        .insert({ ...credit, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-credits', user?.id] });
    },
  });

  const updateCredit = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<GameCredit> & { id: string }) => {
      const { data, error } = await supabase
        .from('game_credits')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-credits', user?.id] });
    },
  });

  const deleteCredit = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('game_credits')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['game-credits', user?.id] });
    },
  });

  return {
    credits,
    isLoading,
    error,
    addCredit,
    updateCredit,
    deleteCredit,
  };
}