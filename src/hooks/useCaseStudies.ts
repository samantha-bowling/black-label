// @ts-nocheck

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

export interface CaseStudy {
  id: string;
  user_id: string;
  project_name: string;
  role_played?: string;
  studio_name?: string;
  timeline?: string;
  contributions?: string[];
  media_url?: string;
  external_link?: string;
  display_order: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export function useCaseStudies(userId?: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const targetUserId = userId || user?.id;

  const { data: caseStudies = [], isLoading, error } = useQuery({
    queryKey: ['case-studies', targetUserId],
    queryFn: async () => {
      if (!targetUserId) return [];
      
      const { data, error } = await supabase
        .from('case_studies')
        .select('*')
        .eq('user_id', targetUserId)
        .order('display_order', { ascending: true });

      if (error) throw error;
      return data as CaseStudy[];
    },
    enabled: !!targetUserId,
  });

  const createCaseStudy = useMutation({
    mutationFn: async (caseStudyData: Omit<CaseStudy, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('case_studies')
        .insert({ ...caseStudyData, user_id: user.id })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['case-studies', targetUserId] });
      toast({ title: "Case study created successfully!" });
    },
    onError: (error) => {
      console.error('Error creating case study:', error);
      toast({ 
        title: "Error creating case study", 
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive" 
      });
    },
  });

  const updateCaseStudy = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CaseStudy> & { id: string }) => {
      const { data, error } = await supabase
        .from('case_studies')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['case-studies', targetUserId] });
      toast({ title: "Case study updated successfully!" });
    },
    onError: (error) => {
      console.error('Error updating case study:', error);
      toast({ 
        title: "Error updating case study", 
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive" 
      });
    },
  });

  const deleteCaseStudy = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('case_studies')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['case-studies', targetUserId] });
      toast({ title: "Case study deleted successfully!" });
    },
    onError: (error) => {
      console.error('Error deleting case study:', error);
      toast({ 
        title: "Error deleting case study", 
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive" 
      });
    },
  });

  return {
    caseStudies,
    isLoading,
    error,
    createCaseStudy: createCaseStudy.mutate,
    updateCaseStudy: updateCaseStudy.mutate,
    deleteCaseStudy: deleteCaseStudy.mutate,
    isCreating: createCaseStudy.isPending,
    isUpdating: updateCaseStudy.isPending,
    isDeleting: deleteCaseStudy.isPending,
  };
}
