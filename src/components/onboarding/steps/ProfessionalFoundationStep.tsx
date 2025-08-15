import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { UserRole } from '@/types/auth';
import { Button, Input, Label, Text, Badge, Card } from '@/components/ui/system';
import { Textarea } from '@/components/ui/textarea';
import { LinkedinIcon, Globe, MapPin, User } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProfessionalFoundationStepProps {
  form: UseFormReturn<any>;
  userRole: UserRole;
  onLinkedInEnrich: () => void;
}

export function ProfessionalFoundationStep({ 
  form, 
  userRole, 
  onLinkedInEnrich 
}: ProfessionalFoundationStepProps) {
  const { register, watch, setValue, formState: { errors } } = form;
  
  const displayNameValue = watch('display_name') || '';
  const bioValue = watch('bio') || '';
  const companyNameValue = watch('company_name') || '';

  const posterTypes = [
    { value: 'indie_dev', label: 'Independent Developer' },
    { value: 'studio', label: 'Studio (2-100 people)' },
    { value: 'agency', label: 'Agency/Consultancy' },
    { value: 'publisher', label: 'Publisher' },
    { value: 'individual', label: 'Individual/Freelancer' }
  ];

  return (
    <div className="space-y-8">
      {/* LinkedIn Integration */}
      <Card variant="highlight" padding="md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <LinkedinIcon className="w-5 h-5 text-white/80" />
            <div>
              <Text weight="semibold" size="sm">Auto-fill from LinkedIn</Text>
              <Text size="xs" variant="secondary">
                Save time by importing your professional information
              </Text>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onLinkedInEnrich}>
            Import Data
          </Button>
        </div>
      </Card>

      {/* Basic Information */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2 mb-4">
          <User className="w-5 h-5 text-white/80" />
          <Text weight="semibold">Professional Identity</Text>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label required>
              {userRole === 'gig_seeker' ? 'Display Name' : 'Your Name'}
            </Label>
            <Input
              {...register('display_name')}
              placeholder="How you want to be known professionally"
              variant="gaming"
              hasError={!!errors.display_name}
            />
            {errors.display_name && (
              <Text size="xs" variant="destructive" className="mt-1">
                {errors.display_name.message as string}
              </Text>
            )}
            <Text size="xs" variant="tertiary" className="mt-1">
              {displayNameValue.length}/50 characters
            </Text>
          </div>

          <div>
            <Label>Email Address</Label>
            <Input
              {...register('email')}
              type="email"
              placeholder="your.email@example.com"
              variant="gaming"
              hasError={!!errors.email}
            />
            {errors.email && (
              <Text size="xs" variant="destructive" className="mt-1">
                {errors.email.message as string}
              </Text>
            )}
          </div>
        </div>

        {/* Role-specific fields */}
        {userRole === 'gig_poster' && (
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label required>Company/Organization Name</Label>
              <Input
                {...register('company_name')}
                placeholder="Your company or studio name"
                variant="gaming"
                hasError={!!errors.company_name}
              />
              {errors.company_name && (
                <Text size="xs" variant="destructive" className="mt-1">
                  {errors.company_name.message as string}
                </Text>
              )}
            </div>

            <div>
              <Label required>Organization Type</Label>
              <Select 
                value={watch('poster_type')}
                onValueChange={(value) => setValue('poster_type', value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select organization type" />
                </SelectTrigger>
                <SelectContent>
                  {posterTypes.map(type => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.poster_type && (
                <Text size="xs" variant="destructive" className="mt-1">
                  {errors.poster_type.message as string}
                </Text>
              )}
            </div>
          </div>
        )}

        <div>
          <Label>Professional Bio</Label>
          <Textarea
            {...register('bio')}
            placeholder={
              userRole === 'gig_seeker' 
                ? "Tell the gaming industry about your expertise, passion, and what makes you unique..."
                : "Describe your organization, the types of projects you work on, and your team culture..."
            }
            className="min-h-[120px] resize-none"
            maxLength={750}
          />
          <div className="flex justify-between mt-1">
            <Text size="xs" variant="tertiary">
              {bioValue.length}/750 characters
            </Text>
            {bioValue.length > 600 && (
              <Badge variant="warning" size="sm">
                {750 - bioValue.length} remaining
              </Badge>
            )}
          </div>
          {errors.bio && (
            <Text size="xs" variant="destructive" className="mt-1">
              {errors.bio.message as string}
            </Text>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label>Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
              <Input
                {...register('location')}
                placeholder="City, Country or Remote"
                className="pl-10"
                variant="gaming"
              />
            </div>
          </div>

          <div>
            <Label>Years of Experience</Label>
            <Select 
              value={watch('years_experience')?.toString()}
              onValueChange={(value) => setValue('years_experience', parseInt(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select experience level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Less than 1 year</SelectItem>
                <SelectItem value="1">1-2 years</SelectItem>
                <SelectItem value="3">3-5 years</SelectItem>
                <SelectItem value="6">6-10 years</SelectItem>
                <SelectItem value="11">11-15 years</SelectItem>
                <SelectItem value="16">15+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Globe className="w-5 h-5 text-white/80" />
            <Text weight="semibold">Professional Links</Text>
            <Badge variant="outline" size="sm">Optional</Badge>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Website/Portfolio</Label>
              <Input
                {...register('website_url')}
                type="url"
                placeholder="https://yourportfolio.com"
                variant="gaming"
                hasError={!!errors.website_url}
              />
              {errors.website_url && (
                <Text size="xs" variant="destructive" className="mt-1">
                  {errors.website_url.message as string}
                </Text>
              )}
            </div>

            <div>
              <Label>LinkedIn Profile</Label>
              <Input
                {...register('linkedin_url')}
                type="url"
                placeholder="https://linkedin.com/in/yourprofile"
                variant="gaming"
                hasError={!!errors.linkedin_url}
              />
              {errors.linkedin_url && (
                <Text size="xs" variant="destructive" className="mt-1">
                  {errors.linkedin_url.message as string}
                </Text>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Profile Preview */}
      <Card variant="gaming" padding="md" className="bg-surface/30">
        <Text weight="semibold" size="sm" className="mb-3">Profile Preview</Text>
        <div className="space-y-2">
          <Text size="lg" weight="semibold">
            {displayNameValue || 'Your Display Name'}
          </Text>
          {userRole === 'gig_poster' && companyNameValue && (
            <Text size="sm" variant="secondary">
              {companyNameValue}
            </Text>
          )}
          <Text size="sm" variant="secondary" className="line-clamp-3">
            {bioValue || `Your professional bio will appear here...`}
          </Text>
        </div>
      </Card>
    </div>
  );
}