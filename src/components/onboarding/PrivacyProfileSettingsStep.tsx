
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonPrimary } from '@/components/ui/primitives';
import { Info, Eye, EyeOff, Shield, Users } from 'lucide-react';
import { useState } from 'react';

interface PrivacyProfileSettingsStepProps {
  form: UseFormReturn<any>;
  onNext: () => void;
  onBack: () => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export function PrivacyProfileSettingsStep({ 
  form, 
  onNext, 
  onBack, 
  onSubmit, 
  isLoading 
}: PrivacyProfileSettingsStepProps) {
  const { setValue, watch } = form;
  const [previewMode, setPreviewMode] = useState<'public' | 'private'>('public');
  
  const publicProfile = watch('public_profile') || false;
  const acceptsIntros = watch('accepts_intros') || true;
  const rateVisibility = watch('rate_visibility') || 'private';

  const handlePublicProfileChange = (checked: boolean) => {
    setValue('public_profile', checked);
    if (!checked) {
      // If making profile private, also set rate visibility to private
      setValue('rate_visibility', 'private');
    }
  };

  const handleRateVisibilityChange = (visibility: string) => {
    setValue('rate_visibility', visibility);
  };

  return (
    <div className="space-y-6">
      {/* Preview Toggle */}
      <div className="flex justify-center">
        <div className="bg-black/20 border border-white/20 rounded-lg p-1 flex">
          <button
            type="button"
            onClick={() => setPreviewMode('public')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              previewMode === 'public'
                ? 'bg-white text-black'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <Eye className="w-4 h-4 inline mr-2" />
            Public View
          </button>
          <button
            type="button"
            onClick={() => setPreviewMode('private')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              previewMode === 'private'
                ? 'bg-white text-black'
                : 'text-white/70 hover:text-white'
            }`}
          >
            <EyeOff className="w-4 h-4 inline mr-2" />
            Private View
          </button>
        </div>
      </div>

      {/* Public Profile Settings */}
      <Card className="bg-black/20 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Users className="w-5 h-5" />
            Profile Visibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-white font-medium">
                Make my profile discoverable
              </Label>
              <p className="text-white/60 text-sm">
                Allow verified project posters to find and view your profile
              </p>
            </div>
            <Switch
              checked={publicProfile}
              onCheckedChange={handlePublicProfileChange}
            />
          </div>

          {publicProfile && (
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-blue-300 font-medium">Your public profile highlights:</p>
                  <ul className="text-blue-200/80 mt-1 space-y-1">
                    <li>• Professional accomplishments and past credits</li>
                    <li>• Skills and expertise areas</li>
                    <li>• Availability status (without specific rates)</li>
                    <li>• Portfolio links and social profiles</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rate Privacy Settings */}
      <Card className="bg-black/20 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Rate Information Privacy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="rate-private"
                name="rate_visibility"
                value="private"
                checked={rateVisibility === 'private'}
                onChange={(e) => handleRateVisibilityChange(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <div>
                <Label htmlFor="rate-private" className="text-white font-medium cursor-pointer">
                  Keep rates completely private
                </Label>
                <p className="text-white/60 text-sm">
                  Never show rate information to anyone
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="radio"
                id="rate-verified"
                name="rate_visibility"
                value="verified_only"
                checked={rateVisibility === 'verified_only'}
                onChange={(e) => handleRateVisibilityChange(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <div>
                <Label htmlFor="rate-verified" className="text-white font-medium cursor-pointer">
                  Show to verified posters only
                </Label>
                <p className="text-white/60 text-sm">
                  Share rate information after mutual interest is established
                </p>
              </div>
            </div>

            {publicProfile && (
              <div className="flex items-center space-x-3 opacity-50">
                <input
                  type="radio"
                  id="rate-public"
                  name="rate_visibility"
                  value="public"
                  disabled
                  className="w-4 h-4 text-blue-600"
                />
                <div>
                  <Label className="text-white/50 font-medium">
                    Show publicly (Coming soon)
                  </Label>
                  <p className="text-white/40 text-sm">
                    Display rate ranges on your public profile
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Introduction Settings */}
      <Card className="bg-black/20 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Communication Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-white font-medium">
                Accept introductions
              </Label>
              <p className="text-white/60 text-sm">
                Allow other users to introduce you to potential collaborators
              </p>
            </div>
            <Switch
              checked={acceptsIntros}
              onCheckedChange={(checked) => setValue('accepts_intros', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Profile Preview Card */}
      <Card className="bg-black/20 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Profile Preview</CardTitle>
          <p className="text-white/70 text-sm">
            {previewMode === 'public' 
              ? 'How your profile appears to project posters'
              : 'How your profile appears when set to private'
            }
          </p>
        </CardHeader>
        <CardContent>
          <div className="bg-black/40 border border-white/10 rounded-lg p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {watch('display_name')?.charAt(0) || 'U'}
                </span>
              </div>
              <div>
                <h3 className="text-white font-semibold">
                  {watch('display_name') || 'Your Name'}
                </h3>
                <p className="text-white/60 text-sm">
                  {previewMode === 'public' && publicProfile
                    ? 'Professional Game Developer'
                    : previewMode === 'private' || !publicProfile
                    ? 'Profile set to private'
                    : 'Available for projects'
                  }
                </p>
              </div>
            </div>

            {previewMode === 'public' && publicProfile ? (
              <div className="space-y-2">
                <p className="text-white/80 text-sm">
                  {watch('bio') || 'Your professional bio will appear here...'}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-white/10 text-white/80 px-2 py-1 rounded text-xs">
                    Core Disciplines
                  </span>
                  <span className="bg-white/10 text-white/80 px-2 py-1 rounded text-xs">
                    Available
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <EyeOff className="w-8 h-8 text-white/40 mx-auto mb-2" />
                <p className="text-white/60 text-sm">
                  Private profile - only you can see your full information
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <ButtonPrimary
          type="button"
          onClick={onBack}
          size="lg"
          className="bg-white/10 hover:bg-white/20"
        >
          Back
        </ButtonPrimary>
        <ButtonPrimary
          type="button"
          onClick={onSubmit}
          size="lg"
          isLoading={isLoading}
        >
          Complete Setup
        </ButtonPrimary>
      </div>
    </div>
  );
}
