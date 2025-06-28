
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AvatarUpload } from './AvatarUpload';
import { URLSlugEditor } from './URLSlugEditor';
import { ProfileForm } from './ProfileForm';
import { ExternalLink } from 'lucide-react';

export function ProfileSettings() {
  const { user } = useAuth();

  const currentProfileUrl = user?.smart_url_slug 
    ? `${window.location.origin}/profile/${user.smart_url_slug}`
    : null;

  return (
    <div className="space-y-6">
      {/* Profile Preview */}
      {currentProfileUrl && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center justify-between text-white">
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
            <p className="text-sm text-white/70">
              This is how others see your profile. Make sure to keep it updated with your latest information.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Avatar Upload */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Profile Picture</CardTitle>
        </CardHeader>
        <CardContent>
          <AvatarUpload />
        </CardContent>
      </Card>

      {/* URL Settings */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Profile URL</CardTitle>
        </CardHeader>
        <CardContent>
          <URLSlugEditor />
        </CardContent>
      </Card>

      <Separator className="bg-white/10" />

      {/* Profile Form - Using the same structure as onboarding */}
      <ProfileForm />
    </div>
  );
}
