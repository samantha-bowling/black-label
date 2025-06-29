
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { validateSlug, sanitizeSlug } from '@/lib/routing/slugValidation';

export function URLSlugEditor() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [slug, setSlug] = useState(user?.smart_url_slug || '');
  const [isChecking, setIsChecking] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [availability, setAvailability] = useState<'available' | 'taken' | 'checking' | 'invalid' | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [checkTimeout, setCheckTimeout] = useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setSlug(user?.smart_url_slug || '');
  }, [user?.smart_url_slug]);

  const checkAvailability = async (slugToCheck: string) => {
    if (!slugToCheck || slugToCheck === user?.smart_url_slug) {
      setAvailability(null);
      setValidationError(null);
      return;
    }

    // Validate slug format first
    const validation = validateSlug(slugToCheck);
    if (!validation.isValid) {
      setAvailability('invalid');
      setValidationError(validation.error || 'Invalid slug format');
      return;
    }

    setIsChecking(true);
    setAvailability('checking');
    setValidationError(null);

    try {
      const { data, error } = await supabase
        .from('users')
        .select('id')
        .eq('smart_url_slug', slugToCheck)
        .single();

      if (error && error.code === 'PGRST116') {
        // No rows returned, slug is available
        setAvailability('available');
      } else if (data) {
        // Slug is taken
        setAvailability('taken');
      }
    } catch (error) {
      console.error('Error checking slug availability:', error);
      setAvailability(null);
    } finally {
      setIsChecking(false);
    }
  };

  const handleSlugChange = (value: string) => {
    // Clean the input using our sanitization utility
    const cleanedValue = sanitizeSlug(value);
    setSlug(cleanedValue);

    // Clear existing timeout
    if (checkTimeout) {
      clearTimeout(checkTimeout);
    }

    // Set new timeout to check availability after user stops typing
    const timeout = setTimeout(() => {
      if (cleanedValue && cleanedValue !== user?.smart_url_slug) {
        checkAvailability(cleanedValue);
      }
    }, 500);

    setCheckTimeout(timeout);
  };

  const handleUpdate = async () => {
    if (!user || !slug || slug === user.smart_url_slug) return;

    setIsUpdating(true);

    try {
      const { error } = await supabase
        .from('users')
        .update({ smart_url_slug: slug })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'URL updated',
        description: 'Your profile URL has been updated successfully.',
      });

      // Refresh page to show changes
      window.location.reload();
    } catch (error) {
      console.error('Error updating slug:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update your profile URL. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusIcon = () => {
    if (isChecking || availability === 'checking') {
      return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />;
    }
    if (availability === 'available') {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    if (availability === 'taken' || availability === 'invalid') {
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    }
    return null;
  };

  const getStatusText = () => {
    if (isChecking || availability === 'checking') return 'Checking availability...';
    if (availability === 'available') return 'Available!';
    if (availability === 'taken') return 'This URL is already taken';
    if (availability === 'invalid') return validationError || 'Invalid URL format';
    return '';
  };

  const currentUrl = `${window.location.origin}/${user?.smart_url_slug}`;

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="url-slug">Profile URL</Label>
        <div className="flex items-center space-x-2 mt-1">
          <span className="text-sm text-muted-foreground">
            {window.location.origin}/
          </span>
          <Input
            id="url-slug"
            value={slug}
            onChange={(e) => handleSlugChange(e.target.value)}
            placeholder="your-name"
            className="flex-1"
          />
          {getStatusIcon()}
        </div>
        {getStatusText() && (
          <p className={`text-sm mt-1 ${
            availability === 'available' ? 'text-green-600' : 
            (availability === 'taken' || availability === 'invalid') ? 'text-red-600' : 
            'text-muted-foreground'
          }`}>
            {getStatusText()}
          </p>
        )}
      </div>

      {user?.smart_url_slug && (
        <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
          <span className="text-sm">Current URL:</span>
          <a
            href={currentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:underline flex items-center"
          >
            {currentUrl}
            <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        </div>
      )}

      <Button
        onClick={handleUpdate}
        disabled={
          isUpdating ||
          !slug ||
          slug === user?.smart_url_slug ||
          availability === 'taken' ||
          availability === 'invalid' ||
          isChecking
        }
      >
        {isUpdating ? 'Updating...' : 'Update URL'}
      </Button>
    </div>
  );
}
