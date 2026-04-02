// @ts-nocheck

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface CollaborationOption {
  id: string;
  user_id: string;
  option_type: string;
  is_active: boolean;
  created_at: string;
}

export const COLLABORATION_TYPES = {
  fractional: 'Fractional Leadership',
  consult: 'Consulting & Advisory',
  pitch_review: 'Pitch Review',
  team_build: 'Team Building',
  leadership_advisory: 'Leadership Advisory',
  creative_direction: 'Creative Direction',
  project_management: 'Project Management',
  technical_architecture: 'Technical Architecture',
} as const;

export function useCollaborationOptions(userId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const targetUserId = userId || user?.id;

  const { data: collaborationOptions = [], isLoading, error } = useQuery({
    queryKey: ['collaboration-options', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return [];
      
      const { data, error } = await supabase
        .from('collaboration_options')
        .select('*')
        .eq('user_id', targetUserId)
        .eq('is_active', true);

      if (error) throw error;
      return data as CollaborationOption[];
    },
    enabled: !!targetUserId,
  });

  const toggleCollaborationOption = useMutation({
    mutationFn: async ({ optionType, isActive }: { optionType: string; isActive: boolean }) => {
      if (!user?.id) throw new Error('User not authenticated');

      if (isActive) {
        // Add the option
        const { data, error } = await supabase
          .from('collaboration_options')
          .insert({ 
            user_id: user.id, 
            option_type: optionType,
            is_active: true 
          })
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // Remove the option
        const { error } = await supabase
          .from('collaboration_options')
          .delete()
          .eq('user_id', user.id)
          .eq('option_type', optionType);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaboration-options', targetUserId] });
    },
    onError: (error) => {
      console.error('Error toggling collaboration option:', error);
      toast({ 
        title: "Error updating collaboration options", 
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive" 
      });
    },
  });

  return {
    collaborationOptions,
    isLoading,
    error,
    toggleCollaborationOption: toggleCollaborationOption.mutate,
    isToggling: toggleCollaborationOption.isPending,
  };
}
