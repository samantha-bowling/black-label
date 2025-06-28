import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export function useInvites() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const validateInvite = async (token: string): Promise<boolean> => {
    try {
      console.log('Validating invite token:', token);
      
      // Direct query approach with better error handling
      const { data, error } = await supabase
        .from('invites')
        .select('token, used_by_user_id, expires_at, created_by_user_id, email')
        .eq('token', token)
        .single();

      if (error) {
        console.error('Direct query error:', error);
        if (error.code === 'PGRST116') {
          console.log('No invite found with this token');
          return false;
        }
        throw error;
      }

      if (!data) {
        console.log('No invite data returned');
        return false;
      }

      console.log('Direct query result:', data);

      // Check if invite is already used
      if (data.used_by_user_id) {
        console.log('Invite already used by user:', data.used_by_user_id);
        return false;
      }

      // Check if invite is expired
      const expiresAt = new Date(data.expires_at);
      const now = new Date();
      if (expiresAt <= now) {
        console.log('Invite expired. Expires:', expiresAt, 'Now:', now);
        return false;
      }

      console.log('Invite is valid');
      return true;

    } catch (error) {
      console.error('Error validating invite:', error);
      return false;
    }
  };

  const createInvite = async (email?: string): Promise<{ token?: string; error?: string }> => {
    if (!user) {
      return { error: 'Must be logged in to create invites' };
    }

    if (user.role !== 'admin' && user.invites_remaining <= 0) {
      return { error: 'No invite tokens remaining' };
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('invites')
        .insert({
          created_by_user_id: user.id,
          email: email || null,
        })
        .select('token')
        .single();

      if (error) {
        toast({
          title: "Error Creating Invite",
          description: error.message,
          variant: "destructive",
        });
        return { error: error.message };
      }

      toast({
        title: "Invite Created",
        description: "Your invite token has been generated successfully.",
      });

      return { token: data.token };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create invite';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      return { error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  };

  const getUserInvites = async () => {
    if (!user) return [];

    try {
      const { data, error } = await supabase
        .from('invites')
        .select(`
          *,
          used_by:used_by_user_id(display_name, email)
        `)
        .eq('created_by_user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching invites:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching invites:', error);
      return [];
    }
  };

  return {
    validateInvite,
    createInvite,
    getUserInvites,
    isLoading,
  };
}
