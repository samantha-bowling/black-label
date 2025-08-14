import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface WorkExperience {
  id: string;
  user_id: string;
  company_name: string;
  position_title: string;
  employment_type?: string;
  start_date: string;
  end_date?: string;
  is_current: boolean;
  location?: string;
  description?: string;
  key_achievements?: string[];
  technologies_used?: string[];
  projects_worked_on?: any[];
  display_order: number;
  created_at: string;
  updated_at: string;
}

export function useWorkExperience(userId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const targetUserId = userId || user?.id;

  const { data: workExperience = [], isLoading, error } = useQuery({
    queryKey: ['work-experience', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return [];
      
      const { data, error } = await supabase
        .from('work_experience')
        .select('*')
        .eq('user_id', targetUserId)
        .order('display_order', { ascending: true })
        .order('start_date', { ascending: false });

      if (error) throw error;
      return data as WorkExperience[];
    },
    enabled: !!targetUserId,
  });

  const addWorkExperience = useMutation({
    mutationFn: async (experience: Omit<WorkExperience, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('work_experience')
        .insert({ ...experience, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-experience', user?.id] });
    },
  });

  const updateWorkExperience = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<WorkExperience> & { id: string }) => {
      const { data, error } = await supabase
        .from('work_experience')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-experience', user?.id] });
    },
  });

  const deleteWorkExperience = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('work_experience')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-experience', user?.id] });
    },
  });

  return {
    workExperience,
    isLoading,
    error,
    addWorkExperience,
    updateWorkExperience,
    deleteWorkExperience,
  };
}