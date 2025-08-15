import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { UserRole } from '@/types/auth';
import { Button, Text, Badge, Card } from '@/components/ui/system';
import { Switch } from '@/components/ui/switch';
import { Shield, Eye, Users, Globe, MessageCircle, CheckCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface WorkPrivacyPreferencesStepProps {
  form: UseFormReturn<any>;
  userRole: UserRole;
}

export function WorkPrivacyPreferencesStep({ form, userRole }: WorkPrivacyPreferencesStepProps) {
  const { watch, setValue } = form;

  const availabilityOptions = [
    { value: 'available', label: 'Available Now', color: 'success' },
    { value: 'open_to_offers', label: 'Open to Offers', color: 'warning' },
    { value: 'not_available', label: 'Not Available', color: 'destructive' },
    { value: 'selective', label: 'Selective Opportunities', color: 'outline' }
  ];

  return (
    <div className="space-y-8">
      {/* Availability Status (Gig Seekers only) */}
      {userRole === 'gig_seeker' && (
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-white/80" />
            <Text weight="semibold">Availability Status</Text>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {availabilityOptions.map((option) => (
              <Card
                key={option.value}
                variant={watch('availability_status') === option.value ? 'highlight' : 'default'}
                padding="md"
                className={`cursor-pointer transition-all duration-200 ${
                  watch('availability_status') === option.value ? 'ring-2 ring-white/30' : ''
                }`}
                onClick={() => setValue('availability_status', option.value)}
              >
                <div className="text-center space-y-2">
                  <Badge variant={option.color as any} size="sm">
                    {option.label}
                  </Badge>
                  <Text size="xs" variant="secondary" className="line-height-tight">
                    {option.value === 'available' && 'Ready to start new projects immediately'}
                    {option.value === 'open_to_offers' && 'Considering the right opportunities'}
                    {option.value === 'not_available' && 'Currently unavailable for new work'}
                    {option.value === 'selective' && 'Only interested in premium projects'}
                  </Text>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Privacy Settings */}
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Shield className="w-5 h-5 text-white/80" />
          <Text weight="semibold">Privacy & Visibility</Text>
        </div>

        {/* Public Profile */}
        <Card variant="gaming" padding="md">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Globe className="w-5 h-5 text-white/80" />
              <div>
                <Text weight="semibold" size="sm">Public Profile</Text>
                <Text size="xs" variant="secondary">
                  Make your profile discoverable by {userRole === 'gig_seeker' ? 'potential clients' : 'talent'}
                </Text>
              </div>
            </div>
            <Switch
              checked={watch('public_profile')}
              onCheckedChange={(checked) => setValue('public_profile', checked)}
            />
          </div>
          
          {watch('public_profile') && (
            <div className="mt-4 p-3 bg-success/10 border border-success/30 rounded-md">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-success" />
                <Text size="xs" variant="success">
                  Your profile will be visible to verified {userRole === 'gig_seeker' ? 'employers and clients' : 'talent'} in our network
                </Text>
              </div>
            </div>
          )}
        </Card>

        {/* Direct Contact (Gig Seekers only) */}
        {userRole === 'gig_seeker' && (
          <Card variant="gaming" padding="md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-white/80" />
                <div>
                  <Text weight="semibold" size="sm">Accept Direct Introductions</Text>
                  <Text size="xs" variant="secondary">
                    Allow verified companies to reach out directly with opportunities
                  </Text>
                </div>
              </div>
              <Switch
                checked={watch('accepts_intros')}
                onCheckedChange={(checked) => setValue('accepts_intros', checked)}
              />
            </div>
          </Card>
        )}

        {/* NDA Preference (Gig Posters) */}
        {userRole === 'gig_poster' && (
          <Card variant="gaming" padding="md">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Shield className="w-5 h-5 text-white/80" />
                <div>
                  <Text weight="semibold" size="sm">Require NDAs</Text>
                  <Text size="xs" variant="secondary">
                    Most projects require signed non-disclosure agreements
                  </Text>
                </div>
              </div>
              <Switch
                checked={watch('nda_required')}
                onCheckedChange={(checked) => setValue('nda_required', checked)}
              />
            </div>
          </Card>
        )}
      </div>

      {/* Platform Guidelines */}
      <Card variant="highlight" padding="md">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-white/80" />
            <Text weight="semibold" size="sm">Platform Standards</Text>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
              <Text size="xs" variant="secondary">
                All {userRole === 'gig_seeker' ? 'profiles are reviewed' : 'organizations are verified'} to maintain quality standards
              </Text>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
              <Text size="xs" variant="secondary">
                {userRole === 'gig_seeker' 
                  ? 'Your information is only visible to verified companies and clients'
                  : 'Your project postings are only visible to pre-screened talent'
                }
              </Text>
            </div>
            
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
              <Text size="xs" variant="secondary">
                Direct contact information is never shared without your explicit consent
              </Text>
            </div>
          </div>
        </div>
      </Card>

      {/* Summary */}
      <Card variant="default" padding="md" className="bg-surface/30">
        <Text weight="semibold" size="sm" className="mb-3">Profile Summary</Text>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Text size="sm" variant="secondary">Profile Visibility</Text>
            <Badge variant={watch('public_profile') ? 'success' : 'outline'} size="sm">
              {watch('public_profile') ? 'Public' : 'Private'}
            </Badge>
          </div>
          
          {userRole === 'gig_seeker' && (
            <>
              <div className="flex justify-between items-center">
                <Text size="sm" variant="secondary">Availability</Text>
                <Badge 
                  variant={
                    watch('availability_status') === 'available' ? 'success' :
                    watch('availability_status') === 'open_to_offers' ? 'warning' :
                    'outline'
                  } 
                  size="sm"
                >
                  {availabilityOptions.find(opt => opt.value === watch('availability_status'))?.label || 'Not Set'}
                </Badge>
              </div>
              
              <div className="flex justify-between items-center">
                <Text size="sm" variant="secondary">Direct Contact</Text>
                <Badge variant={watch('accepts_intros') ? 'success' : 'outline'} size="sm">
                  {watch('accepts_intros') ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            </>
          )}
          
          {userRole === 'gig_poster' && (
            <div className="flex justify-between items-center">
              <Text size="sm" variant="secondary">NDA Requirement</Text>
              <Badge variant={watch('nda_required') ? 'success' : 'outline'} size="sm">
                {watch('nda_required') ? 'Required' : 'Optional'}
              </Badge>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}