
import { UseFormReturn } from 'react-hook-form';
import { FormSection } from '@/components/forms/FormSection';
import { FormFieldGroup } from '@/components/forms/FormFieldGroup';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  gigSeekerWorkPreferencesFields, 
  gigSeekerRateFields, 
  gigSeekerStoryFields 
} from '@/lib/forms/fieldConfigs';
import { Briefcase, DollarSign, Star, Info } from 'lucide-react';

const GIG_TYPE_OPTIONS = [
  'Full-time', 'Part-time', 'Contract', 'Freelance', 'Remote', 'On-site'
];

interface GigSeekerFieldsProps {
  form: UseFormReturn<any>;
}

export function GigSeekerFields({ form }: GigSeekerFieldsProps) {
  const { setValue, watch } = form;
  const selectedGigTypes = watch('desired_gig_types') || [];

  const toggleGigType = (gigType: string) => {
    const updatedTypes = selectedGigTypes.includes(gigType)
      ? selectedGigTypes.filter((t: string) => t !== gigType)
      : [...selectedGigTypes, gigType];
    setValue('desired_gig_types', updatedTypes);
  };

  return (
    <div className="space-y-6">
      <FormSection
        title="Professional Story"
        subtitle="Share your experience and accomplishments"
        icon={<Star className="w-5 h-5" />}
        infoMessage={{
          title: "Focus on impact",
          description: "Highlight outcomes and achievements rather than just responsibilities",
          variant: "info"
        }}
      >
        <FormFieldGroup
          fields={gigSeekerStoryFields}
          form={form}
        />
      </FormSection>

      <FormSection
        title="Work Preferences"
        subtitle="Tell us about your ideal opportunities"
        icon={<Briefcase className="w-5 h-5" />}
      >
        <div className="space-y-4">
          <div>
            <Label className="text-white mb-3 block">
              Desired Gig Types
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {GIG_TYPE_OPTIONS.map((gigType) => (
                <div key={gigType} className="flex items-center space-x-2">
                  <Checkbox
                    id={gigType}
                    checked={selectedGigTypes.includes(gigType)}
                    onCheckedChange={() => toggleGigType(gigType)}
                  />
                  <Label
                    htmlFor={gigType}
                    className="text-white/80 text-sm cursor-pointer"
                  >
                    {gigType}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <FormFieldGroup
            fields={gigSeekerWorkPreferencesFields}
            form={form}
          />
        </div>
      </FormSection>

      <FormSection
        title="Rate Information"
        subtitle="Help projects find the right fit"
        icon={<DollarSign className="w-5 h-5" />}
        badge="Optional & Private"
        infoMessage={{
          title: "Rate information is private by default",
          description: "This information is only shared with verified project posters after mutual interest is established. Your public profile focuses on your accomplishments and expertise.",
          variant: "info"
        }}
      >
        <FormFieldGroup
          fields={gigSeekerRateFields}
          form={form}
          columns={2}
        />
      </FormSection>
    </div>
  );
}
