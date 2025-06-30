
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormFieldGroup } from '@/components/forms/FormFieldGroup';
import { MultiSelectPills } from '@/components/forms/MultiSelectPills';
import { sharedOnboardingFields } from '@/lib/forms/fieldConfigs';

const CORE_DISCIPLINES_OPTIONS = [
  'Game Design', 'Level Design', 'Systems Design', 'UI/UX Design', 'Narrative Design',
  'Programming', 'Art Direction', 'Concept Art', '3D Modeling', 'Animation',
  'Audio Design', 'Music Composition', 'Voice Acting', 'Quality Assurance',
  'Project Management', 'Producer', 'Marketing', 'Community Management'
];

interface BasicInformationSectionProps {
  form: UseFormReturn<any>;
}

export function BasicInformationSection({ form }: BasicInformationSectionProps) {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Basic Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
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

        <MultiSelectPills
          label="Core Disciplines"
          options={CORE_DISCIPLINES_OPTIONS}
          selectedOptions={form.watch('core_disciplines') || []}
          onChange={(selected) => form.setValue('core_disciplines', selected)}
          maxSelections={3}
          description="Your main areas of expertise (max 3)"
        />
      </CardContent>
    </Card>
  );
}
