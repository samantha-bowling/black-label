// @ts-nocheck
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PosterType } from '@/types/auth';

interface PosterOnboardingData {
  display_name: string;
  bio?: string;
  company_name?: string;
  location?: string;
  website_url?: string;
  linkedin_url?: string;
  poster_type?: PosterType;
}

interface PosterOnboardingFieldsProps {
  form: UseFormReturn<PosterOnboardingData>;
}

export function PosterOnboardingFields({ form }: PosterOnboardingFieldsProps) {
  const { register, setValue, watch, formState: { errors } } = form;
  const posterType = watch('poster_type');

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="display_name">Display Name *</Label>
        <Input
          id="display_name"
          placeholder="Your name or organization"
          {...register('display_name', { required: 'Display name is required' })}
        />
        {errors.display_name && (
          <p className="text-sm text-red-500">{errors.display_name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">What types of projects do you hire for? *</Label>
        <Textarea
          id="bio"
          placeholder="Describe the types of projects, roles, and talent you typically work with..."
          rows={4}
          {...register('bio', { required: 'Project description is required' })}
        />
        {errors.bio && (
          <p className="text-sm text-red-500">{errors.bio.message}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="poster_type">Organization Type</Label>
          <Select onValueChange={(value) => setValue('poster_type', value as PosterType)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="individual">Individual</SelectItem>
              <SelectItem value="indie_dev">Indie Developer</SelectItem>
              <SelectItem value="studio">Studio</SelectItem>
              <SelectItem value="agency">Agency</SelectItem>
              <SelectItem value="publisher">Publisher</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="City, Country"
            {...register('location')}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="company_name">Company/Organization Name</Label>
        <Input
          id="company_name"
          placeholder="Your company or organization"
          {...register('company_name')}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="website_url">Website</Label>
          <Input
            id="website_url"
            type="url"
            placeholder="https://yourcompany.com"
            {...register('website_url')}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedin_url">LinkedIn</Label>
          <Input
            id="linkedin_url"
            type="url"
            placeholder="https://linkedin.com/in/yourprofile"
            {...register('linkedin_url')}
          />
        </div>
      </div>
    </div>
  );
}
