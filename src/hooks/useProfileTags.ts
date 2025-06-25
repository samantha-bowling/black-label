
import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ProfileTag, UserProfileTag, TagCategory, TAG_SELECTION_LIMITS } from '@/types/profile-tags';
import { useToast } from '@/hooks/use-toast';

export function useProfileTags() {
  const { toast } = useToast();

  // Fetch all available profile tags
  const { data: profileTags = [], isLoading: isLoadingTags } = useQuery({
    queryKey: ['profile-tags'],
    queryFn: async (): Promise<ProfileTag[]> => {
      const { data, error } = await supabase
        .from('profile_tags')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) throw error;
      return data;
    },
  });

  // Group tags by category
  const tagsByCategory = profileTags.reduce((acc, tag) => {
    if (!acc[tag.category]) {
      acc[tag.category] = [];
    }
    acc[tag.category].push(tag);
    return acc;
  }, {} as Record<TagCategory, ProfileTag[]>);

  return {
    profileTags,
    tagsByCategory,
    isLoadingTags,
  };
}

export function useUserProfileTags(userId?: string) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Fetch user's selected tags
  const { data: userTags = [], isLoading: isLoadingUserTags, refetch } = useQuery({
    queryKey: ['user-profile-tags', userId],
    queryFn: async (): Promise<UserProfileTag[]> => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('user_profile_tags')
        .select(`
          *,
          tag:profile_tags(*)
        `)
        .eq('user_id', userId);

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  // Group user tags by category
  const userTagsByCategory = userTags.reduce((acc, userTag) => {
    if (userTag.tag) {
      const category = userTag.tag.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(userTag);
    }
    return acc;
  }, {} as Record<TagCategory, UserProfileTag[]>);

  // Add/remove user tag
  const updateUserTagsMutation = useMutation({
    mutationFn: async ({ 
      tagIds, 
      category 
    }: { 
      tagIds: string[]; 
      category: TagCategory;
    }) => {
      if (!userId) throw new Error('User ID is required');

      // Validate selection limits
      const limits = TAG_SELECTION_LIMITS[category];
      if (tagIds.length < limits.min) {
        throw new Error(`Please select at least ${limits.min} ${category.replace('_', ' ')}`);
      }
      if (tagIds.length > limits.max) {
        throw new Error(`Please select no more than ${limits.max} ${category.replace('_', ' ')}`);
      }

      // Remove existing tags for this category
      const existingCategoryTags = userTagsByCategory[category] || [];
      if (existingCategoryTags.length > 0) {
        const { error: deleteError } = await supabase
          .from('user_profile_tags')
          .delete()
          .eq('user_id', userId)
          .in('tag_id', existingCategoryTags.map(ut => ut.tag_id));

        if (deleteError) throw deleteError;
      }

      // Add new tags
      if (tagIds.length > 0) {
        const { error: insertError } = await supabase
          .from('user_profile_tags')
          .insert(
            tagIds.map(tagId => ({
              user_id: userId,
              tag_id: tagId,
            }))
          );

        if (insertError) throw insertError;
      }
    },
    onSuccess: (_, { category }) => {
      queryClient.invalidateQueries({ queryKey: ['user-profile-tags', userId] });
      toast({
        title: "Tags Updated",
        description: `Your ${category.replace('_', ' ')} have been updated successfully.`,
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return {
    userTags,
    userTagsByCategory,
    isLoadingUserTags,
    updateUserTags: updateUserTagsMutation.mutate,
    isUpdatingTags: updateUserTagsMutation.isPending,
    refetch,
  };
}
