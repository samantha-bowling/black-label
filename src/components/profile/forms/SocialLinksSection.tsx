
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormFieldGroup } from '@/components/forms/FormFieldGroup';
import { socialLinksFields } from '@/lib/forms/fieldConfigs';

interface SocialLinksSectionProps {
  form: UseFormReturn<any>;
}

export function SocialLinksSection({ form }: SocialLinksSectionProps) {
  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Social Links</CardTitle>
      </CardHeader>
      <CardContent>
        <FormFieldGroup
          fields={socialLinksFields}
          form={form}
          columns={1}
        />
      </CardContent>
    </Card>
  );
}
