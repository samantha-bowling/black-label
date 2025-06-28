
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AvatarUpload } from './AvatarUpload';
import { URLSlugEditor } from './URLSlugEditor';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink } from 'lucide-react';

export function ProfileSettings() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    location: '',
    websiteUrl: '',
    linkedinUrl: '',
    skills: '',
    pastCredits: '',
    socialLinks: {} as Record<string, string>,
  });

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.displayName || '',
        bio: user.bio || '',
        location: user.location || '',
        websiteUrl: user.website_url || '',
        linkedinUrl: user.linkedin_url || '',
        skills: user.skills?.join(', ') || '',
        pastCredits: user.past_credits || '',
        socialLinks: user.social_links || {},
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsUpdating(true);

    try {
      const updateData = {
        display_name: formData.displayName,
        bio: formData.bio,
        location: formData.location,
        website_url: formData.websiteUrl || null,
        linkedin_url: formData.linkedinUrl || null,
        skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(s => s) : null,
        past_credits: formData.pastCredits || null,
        social_links: Object.keys(formData.socialLinks).length > 0 ? formData.socialLinks : null,
      };

      const { error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });

      // Refresh page to show changes
      window.location.reload();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Update failed',
        description: 'Failed to update your profile. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const currentProfileUrl = user?.smart_url_slug 
    ? `${window.location.origin}/profile/${user.smart_url_slug}`
    : null;

  return (
    <div className="space-y-6">
      {/* Profile Preview */}
      {currentProfileUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Public Profile
              <Button variant="outline" size="sm" asChild>
                <a href={currentProfileUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Profile
                </a>
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This is how others see your profile. Make sure to keep it updated with your latest information.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Avatar Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
        </CardHeader>
        <CardContent>
          <AvatarUpload />
        </CardContent>
      </Card>

      {/* URL Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Profile URL</CardTitle>
        </CardHeader>
        <CardContent>
          <URLSlugEditor />
        </CardContent>
      </Card>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                value={formData.displayName}
                onChange={(e) => handleInputChange('displayName', e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="City, Country"
              />
            </div>

            <div>
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                value={formData.skills}
                onChange={(e) => handleInputChange('skills', e.target.value)}
                placeholder="Skill 1, Skill 2, Skill 3"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Separate skills with commas
              </p>
            </div>

            <div>
              <Label htmlFor="pastCredits">Past Credits & Experience</Label>
              <Textarea
                id="pastCredits"
                value={formData.pastCredits}
                onChange={(e) => handleInputChange('pastCredits', e.target.value)}
                placeholder="Your notable projects and experience..."
                rows={3}
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h4 className="font-medium">Links</h4>
              
              <div>
                <Label htmlFor="websiteUrl">Website</Label>
                <Input
                  id="websiteUrl"
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => handleInputChange('websiteUrl', e.target.value)}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div>
                <Label htmlFor="linkedinUrl">LinkedIn</Label>
                <Input
                  id="linkedinUrl"
                  type="url"
                  value={formData.linkedinUrl}
                  onChange={(e) => handleInputChange('linkedinUrl', e.target.value)}
                  placeholder="https://linkedin.com/in/yourprofile"
                />
              </div>

              <div>
                <Label htmlFor="twitter">Twitter/X</Label>
                <Input
                  id="twitter"
                  value={formData.socialLinks.twitter || ''}
                  onChange={(e) => handleSocialLinkChange('twitter', e.target.value)}
                  placeholder="https://twitter.com/yourusername"
                />
              </div>

              <div>
                <Label htmlFor="github">GitHub</Label>
                <Input
                  id="github"
                  value={formData.socialLinks.github || ''}
                  onChange={(e) => handleSocialLinkChange('github', e.target.value)}
                  placeholder="https://github.com/yourusername"
                />
              </div>
            </div>

            <Button type="submit" disabled={isUpdating} className="w-full">
              {isUpdating ? 'Updating...' : 'Save Changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
