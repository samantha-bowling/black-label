
import { UseFormReturn } from 'react-hook-form';
import { FormSection } from '@/components/forms/FormSection';
import { FormFieldGroup } from '@/components/forms/FormFieldGroup';
import { sharedOnboardingFields, socialLinksFields } from '@/lib/forms/fieldConfigs';
import { User } from 'lucide-react';

interface SharedOnboardingFieldsProps {
  form: UseFormReturn<any>;
}

export function SharedOnboardingFields({ form }: SharedOnboardingFieldsProps) {
  return (
    <div className="space-y-6">
      <FormSection
        title="Basic Information"
        subtitle="Tell us about yourself"
        icon={<User className="w-5 h-5" />}
      >
        <FormFieldGroup
          fields={sharedOnboardingFields}
          form={form}
        />
      </FormSection>

      <FormSection
        title="Social Links"
        subtitle="Connect your online presence"
      >
        <FormFieldGroup
          fields={socialLinksFields}
          form={form}
        />
      </FormSection>
    </div>
  );
}
