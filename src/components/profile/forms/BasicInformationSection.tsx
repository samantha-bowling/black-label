
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormFieldGroup } from '@/components/forms/FormFieldGroup';
import { sharedOnboardingFields } from '@/lib/forms/fieldConfigs';

interface BasicInformationSectionProps {
  form: UseFormReturn<any>;
}

export function BasicInformationSection({ form }: BasicInformationSectionProps) {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Basic Information</CardTitle>
      </CardHeader>
      <CardContent>
        <FormFieldGroup
          fields={[
            ...sharedOnboardingFields,
            {
              id: 'location',
              label: 'Location',
              type: 'text',
              placeholder: 'City, Country',
              description: 'Where are you based?'
            },
            {
              id: 'years_experience',
              label: 'Years of Professional Experience',
              type: 'number',
              placeholder: 'e.g., 5',
              description: 'How many years have you been working professionally?',
              validation: {
                min: { value: 0, message: 'Experience cannot be negative' },
                max: { value: 50, message: 'Please enter a realistic number of years' }
              }
            }
          ]}
          form={form}
          columns={1}
        />
      </CardContent>
    </Card>
  );
}
