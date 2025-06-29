
import { UseFormReturn } from 'react-hook-form';
import { FormSection } from '@/components/forms/FormSection';
import { FormFieldGroup } from '@/components/forms/FormFieldGroup';
import { sharedOnboardingFields, socialLinksFields } from '@/lib/forms/fieldConfigs';
import { User, MapPin } from 'lucide-react';

interface SharedOnboardingFieldsProps {
  form: UseFormReturn<any>;
}

export function SharedOnboardingFields({ form }: SharedOnboardingFieldsProps) {
  const bioValue = form.watch('bio') || '';
  const bioCharCount = bioValue.length;
  const bioLimit = 750;
  const displayNameValue = form.watch('display_name') || '';

  return (
    <div className="space-y-6">
      <FormSection
        title="Basic Information"
        subtitle="Tell us about yourself"
        icon={<User className="w-5 h-5" />}
      >
        <div className="space-y-4">
          <FormFieldGroup
            fields={sharedOnboardingFields}
            form={form}
          />
          
          {/* Enhanced character counters */}
          <div className="flex justify-between text-sm">
            <div className={`${displayNameValue.length > 50 ? 'text-red-400' : 'text-white/60'}`}>
              Display name: {displayNameValue.length}/50 characters
            </div>
            <div className={`${bioCharCount > bioLimit ? 'text-red-400' : 'text-white/60'}`}>
              Bio: {bioCharCount}/{bioLimit} characters
            </div>
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Social Links"
        subtitle="Connect your online presence (optional)"
        icon={<MapPin className="w-5 h-5" />}
      >
        <FormFieldGroup
          fields={socialLinksFields}
          form={form}
        />
      </FormSection>
    </div>
  );
}
