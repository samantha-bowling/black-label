
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { InputLuxe } from '@/components/ui/primitives';
import { Textarea } from '@/components/ui/textarea';

interface SharedOnboardingFieldsProps {
  form: UseFormReturn<any>;
}

export function SharedOnboardingFields({ form }: SharedOnboardingFieldsProps) {
  const { register, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="display_name" className="text-white">
          Display Name *
        </Label>
        <InputLuxe
          id="display_name"
          {...register('display_name', { required: 'Display name is required' })}
          placeholder="How should others see your name?"
          error={!!errors.display_name}
        />
        {errors.display_name && (
          <p className="text-destructive text-sm mt-1">
            {errors.display_name.message as string}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="bio" className="text-white">
          Bio
        </Label>
        <Textarea
          id="bio"
          {...register('bio')}
          placeholder="Tell us about yourself..."
          className="min-h-[100px] bg-black/20 border-white/20 text-white placeholder:text-white/50"
        />
      </div>

      <div>
        <Label className="text-white mb-4 block">Social Links</Label>
        <div className="space-y-3">
          <div>
            <Label htmlFor="linkedin" className="text-white/80 text-sm">
              LinkedIn
            </Label>
            <InputLuxe
              id="linkedin"
              {...register('social_links.linkedin')}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
          <div>
            <Label htmlFor="github" className="text-white/80 text-sm">
              GitHub
            </Label>
            <InputLuxe
              id="github"
              {...register('social_links.github')}
              placeholder="https://github.com/username"
            />
          </div>
          <div>
            <Label htmlFor="website" className="text-white/80 text-sm">
              Website
            </Label>
            <InputLuxe
              id="website"
              {...register('social_links.website')}
              placeholder="https://yourwebsite.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
