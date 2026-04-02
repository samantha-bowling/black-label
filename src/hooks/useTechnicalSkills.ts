// @ts-nocheck
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface TechnicalSkill {
  id: string;
  user_id: string;
  skill_name: string;
  skill_category: string;
  proficiency_level: string;
  years_experience?: number;
  last_used_date?: string;
  is_primary_skill: boolean;
  endorsement_count: number;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export const SKILL_CATEGORIES = [
  'Programming',
  'Game Engines',
  'Art & Design',
  'Audio',
  'Project Management',
  'Quality Assurance',
  'DevOps',
  'Other'
] as const;

export const PROFICIENCY_LEVELS = [
  'Beginner',
  'Intermediate', 
  'Advanced',
  'Expert'
] as const;

export function useTechnicalSkills(userId?: string) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  
  const targetUserId = userId || user?.id;

  const { data: skills = [], isLoading, error } = useQuery({
    queryKey: ['technical-skills', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return [];
      
      const { data, error } = await supabase
        .from('technical_skills')
        .select('*')
        .eq('user_id', targetUserId)
        .order('is_primary_skill', { ascending: false })
        .order('proficiency_level', { ascending: false })
        .order('skill_name', { ascending: true });

      if (error) throw error;
      return data as TechnicalSkill[];
    },
    enabled: !!targetUserId,
  });

  const addSkill = useMutation({
    mutationFn: async (skill: Omit<TechnicalSkill, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'endorsement_count'>) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('technical_skills')
        .insert({ ...skill, user_id: user.id, endorsement_count: 0 })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technical-skills', user?.id] });
    },
  });

  const updateSkill = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<TechnicalSkill> & { id: string }) => {
      const { data, error } = await supabase
        .from('technical_skills')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technical-skills', user?.id] });
    },
  });

  const deleteSkill = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('technical_skills')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['technical-skills', user?.id] });
    },
  });

  return {
    skills,
    isLoading,
    error,
    addSkill,
    updateSkill,
    deleteSkill,
  };
}