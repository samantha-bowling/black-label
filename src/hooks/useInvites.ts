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
      console.log('🔍 Starting invite validation for token:', token);
      
      // Validate UUID format first
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(token)) {
        console.log('❌ Invalid UUID format:', token);
        return false;
      }

      console.log('✅ Token format is valid, querying database...');

      // Primary validation via direct database query
      const { data, error } = await supabase
        .from('invites')
        .select('token, used_by_user_id, expires_at, created_by_user_id, email')
        .eq('token', token)
        .maybeSingle();

      console.log('📊 Database query result:', { data, error });

      if (error) {
        console.error('❌ Database query error:', error);
        
        // Check if this is an RLS error and try fallback
        if (error.message?.includes('RLS') || error.message?.includes('policy')) {
          console.log('🔄 RLS error detected, trying fallback validation...');
          return await validateInviteViaEdgeFunction(token);
        }
        
        return false;
      }

      if (!data) {
        console.log('❌ No invite found with token:', token);
        return false;
      }

      console.log('✅ Found invite data:', {
        token: data.token,
        used_by_user_id: data.used_by_user_id,
        expires_at: data.expires_at,
        created_by_user_id: data.created_by_user_id,
        email: data.email
      });

      // Check if invite is already used
      if (data.used_by_user_id) {
        console.log('❌ Invite already used by user:', data.used_by_user_id);
        return false;
      }

      // Check if invite is expired
      const expiresAt = new Date(data.expires_at);
      const now = new Date();
      if (expiresAt <= now) {
        console.log('❌ Invite expired. Expires:', expiresAt.toISOString(), 'Now:', now.toISOString());
        return false;
      }

      console.log('✅ Invite is valid and ready to use!');
      return true;

    } catch (error) {
      console.error('💥 Unexpected error during invite validation:', error);
      
      // Try fallback validation if primary method fails
      console.log('🔄 Attempting fallback validation...');
      return await validateInviteViaEdgeFunction(token);
    }
  };

  const validateInviteViaEdgeFunction = async (token: string): Promise<boolean> => {
    try {
      console.log('🌐 Using edge function for invite validation...');
      
      const { data, error } = await supabase.functions.invoke('validate-invite', {
        body: { token }
      });

      console.log('📡 Edge function response:', { data, error });

      if (error) {
        console.error('❌ Edge function error:', error);
        return false;
      }

      const isValid = data?.isValid === true;
      console.log('🔍 Edge function validation result:', isValid);
      
      return isValid;
    } catch (error) {
      console.error('💥 Edge function validation failed:', error);
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
