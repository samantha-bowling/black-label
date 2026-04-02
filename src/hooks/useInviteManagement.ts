// @ts-nocheck

import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export function useInviteManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const updateInvite = async (inviteId: string, updates: { email?: string }): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Must be logged in to update invites' };
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('invites')
        .update(updates)
        .eq('id', inviteId)
        .eq('created_by_user_id', user.id)
        .is('used_by_user_id', null);

      if (error) {
        toast({
          title: "Error Updating Invite",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      toast({
        title: "Invite Updated",
        description: "Your invite has been updated successfully.",
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update invite';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const deleteInvite = async (inviteId: string): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'Must be logged in to delete invites' };
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('invites')
        .delete()
        .eq('id', inviteId)
        .eq('created_by_user_id', user.id)
        .is('used_by_user_id', null);

      if (error) {
        toast({
          title: "Error Deleting Invite",
          description: error.message,
          variant: "destructive",
        });
        return { success: false, error: error.message };
      }

      toast({
        title: "Invite Deleted",
        description: "Your invite has been deleted successfully.",
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete invite';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    updateInvite,
    deleteInvite,
    isLoading,
  };
}
