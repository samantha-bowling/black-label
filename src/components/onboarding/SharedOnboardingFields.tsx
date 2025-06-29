
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
          
          {/* Bio character counter */}
          <div className="text-right text-sm">
            <span className={`${bioCharCount > bioLimit ? 'text-red-400' : 'text-white/60'}`}>
              {bioCharCount}/{bioLimit} characters
            </span>
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Social Links"
        subtitle="Connect your online presence"
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
