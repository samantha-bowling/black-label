
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
      console.log('Fetching profile tags...');
      const { data, error } = await supabase
        .from('profile_tags')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');

      if (error) {
        console.error('Error fetching profile tags:', error);
        throw error;
      }
      console.log('Profile tags fetched:', data?.length);
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

      console.log('Fetching user tags for user:', userId);
      const { data, error } = await supabase
        .from('user_profile_tags')
        .select(`
          *,
          tag:profile_tags(*)
        `)
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching user tags:', error);
        throw error;
      }
      console.log('User tags fetched:', data?.length);
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

  // Enhanced mutation with better error handling and logging
  const updateUserTagsMutation = useMutation({
    mutationFn: async ({ 
      tagIds, 
      category 
    }: { 
      tagIds: string[]; 
      category: TagCategory;
    }) => {
      if (!userId) throw new Error('User ID is required');

      console.log(`Updating ${category} tags for user ${userId}:`, tagIds);

      // Validate selection limits
      const limits = TAG_SELECTION_LIMITS[category];
      if (tagIds.length < limits.min) {
        throw new Error(`Please select at least ${limits.min} ${category.replace('_', ' ')}`);
      }
      if (tagIds.length > limits.max) {
        throw new Error(`Please select no more than ${limits.max} ${category.replace('_', ' ')}`);
      }

      // Start a transaction-like approach
      console.log('Starting tag update process...');

      // Remove existing tags for this category first
      const existingCategoryTags = userTagsByCategory[category] || [];
      if (existingCategoryTags.length > 0) {
        console.log(`Removing ${existingCategoryTags.length} existing tags for category ${category}`);
        const { error: deleteError } = await supabase
          .from('user_profile_tags')
          .delete()
          .eq('user_id', userId)
          .in('tag_id', existingCategoryTags.map(ut => ut.tag_id));

        if (deleteError) {
          console.error('Delete error:', deleteError);
          throw new Error(`Failed to update tags: ${deleteError.message}`);
        }
        console.log('Successfully removed existing tags');
      }

      // Add new tags with improved conflict handling
      if (tagIds.length > 0) {
        console.log(`Adding ${tagIds.length} new tags for category ${category}`);
        const insertData = tagIds.map(tagId => ({
          user_id: userId,
          tag_id: tagId,
        }));

        const { error: insertError } = await supabase
          .from('user_profile_tags')
          .insert(insertData);

        if (insertError) {
          console.error('Insert error:', insertError);
          // If it's a constraint violation, try to handle it gracefully
          if (insertError.code === '23505') { // unique_violation
            console.log('Unique constraint violation - attempting upsert');
            const { error: upsertError } = await supabase
              .from('user_profile_tags')
              .upsert(insertData, { 
                onConflict: 'user_id,tag_id',
                ignoreDuplicates: true 
              });
            
            if (upsertError) {
              console.error('Upsert error:', upsertError);
              throw new Error(`Failed to save tags: ${upsertError.message}`);
            }
          } else {
            throw new Error(`Failed to save tags: ${insertError.message}`);
          }
        }
        console.log('Successfully added new tags');
      }

      console.log('Tag update completed successfully');
    },
    onSuccess: (_, { category }) => {
      console.log(`Successfully updated ${category} tags`);
      queryClient.invalidateQueries({ queryKey: ['user-profile-tags', userId] });
      toast({
        title: "Tags Updated",
        description: `Your ${category.replace('_', ' ')} have been updated successfully.`,
      });
    },
    onError: (error) => {
      console.error('Tag update mutation error:', error);
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
