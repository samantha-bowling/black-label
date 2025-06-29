
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormFieldGroup } from '@/components/forms/FormFieldGroup';
import {
  gigPosterCompanyFields,
  gigPosterBudgetFields,
  gigPosterProjectFields,
  gigPosterContactFields
} from '@/lib/forms/fieldConfigs';

interface GigPosterSectionProps {
  form: UseFormReturn<any>;
}

export function GigPosterSection({ form }: GigPosterSectionProps) {
  return (
    <>
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Organization Details</CardTitle>
        </CardHeader>
        <CardContent>
          <FormFieldGroup
            fields={gigPosterCompanyFields}
            form={form}
            columns={1}
          />
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Project Information</CardTitle>
        </CardHeader>
        <CardContent>
          <FormFieldGroup
            fields={[...gigPosterBudgetFields, ...gigPosterProjectFields]}
            form={form}
            columns={2}
          />
        </CardContent>
      </Card>

      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <FormFieldGroup
            fields={gigPosterContactFields}
            form={form}
            columns={2}
          />
        </CardContent>
      </Card>
    </>
  );
}
