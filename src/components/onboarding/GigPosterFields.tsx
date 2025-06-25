
import { UseFormReturn } from 'react-hook-form';
import { FormSection } from '@/components/forms/FormSection';
import { FormFieldGroup } from '@/components/forms/FormFieldGroup';
import { 
  gigPosterCompanyFields, 
  gigPosterBudgetFields, 
  gigPosterProjectFields,
  gigPosterContactFields 
} from '@/lib/forms/fieldConfigs';
import { Building, DollarSign, Clock, Phone } from 'lucide-react';

interface GigPosterFieldsProps {
  form: UseFormReturn<any>;
}

export function GigPosterFields({ form }: GigPosterFieldsProps) {
  return (
    <div className="space-y-6">
      <FormSection
        title="Organization Details"
        subtitle="Tell us about your company or studio"
        icon={<Building className="w-5 h-5" />}
      >
        <FormFieldGroup
          fields={gigPosterCompanyFields}
          form={form}
        />
      </FormSection>

      <FormSection
        title="Budget Information"
        subtitle="Help talent understand your typical project scope"
        icon={<DollarSign className="w-5 h-5" />}
      >
        <FormFieldGroup
          fields={gigPosterBudgetFields}
          form={form}
          columns={2}
        />
      </FormSection>

      <FormSection
        title="Project Preferences"
        subtitle="Share your working style and expectations"
        icon={<Clock className="w-5 h-5" />}
      >
        <FormFieldGroup
          fields={gigPosterProjectFields}
          form={form}
        />
      </FormSection>

      <FormSection
        title="Contact Information"
        subtitle="How can talent learn more about you?"
        icon={<Phone className="w-5 h-5" />}
      >
        <FormFieldGroup
          fields={gigPosterContactFields}
          form={form}
          columns={2}
        />
      </FormSection>
    </div>
  );
}
