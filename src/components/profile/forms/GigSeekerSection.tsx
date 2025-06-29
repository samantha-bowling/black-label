
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormFieldGroup } from '@/components/forms/FormFieldGroup';
import { 
  gigSeekerWorkPreferencesFields,
  gigSeekerRateFields,
  gigSeekerStoryFields
} from '@/lib/forms/fieldConfigs';

interface GigSeekerSectionProps {
  form: UseFormReturn<any>;
}

export function GigSeekerSection({ form }: GigSeekerSectionProps) {
  return (
    <>
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Work Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <FormFieldGroup
            fields={[
              ...gigSeekerWorkPreferencesFields,
              {
                id: 'desired_gig_types',
                label: 'Desired Gig Types',
                type: 'text',
                placeholder: 'Game Design, Level Design, UI/UX',
                description: 'Separate with commas'
              }
            ]}
            form={form}
            columns={1}
          />
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Rate & Experience</CardTitle>
        </CardHeader>
        <CardContent>
          <FormFieldGroup
            fields={[
              ...gigSeekerRateFields,
              {
                id: 'skills',
                label: 'Skills',
                type: 'text',
                placeholder: 'Unity, C#, Game Design, etc.',
                description: 'Separate with commas'
              }
            ]}
            form={form}
            columns={2}
          />
          <div className="mt-4">
            <FormFieldGroup
              fields={gigSeekerStoryFields}
              form={form}
              columns={1}
            />
          </div>
        </CardContent>
      </Card>
    </>
  );
}
