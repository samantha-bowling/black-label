
import { UseFormReturn } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormFieldGroup } from '@/components/forms/FormFieldGroup';
import { MultiSelectPills } from '@/components/forms/MultiSelectPills';
import { RateSelector } from '@/components/forms/RateSelector';
import { AwardsSelector } from '@/components/forms/AwardsSelector';
import { 
  gigSeekerWorkPreferencesFields,
  AVAILABLE_FOR_OPTIONS,
  WORK_STYLE_OPTIONS
} from '@/lib/forms/fieldConfigs';
import { useProfileTags } from '@/hooks/useProfileTags';

interface GigSeekerSectionProps {
  form: UseFormReturn<any>;
}

export function GigSeekerSection({ form }: GigSeekerSectionProps) {
  const { watch, setValue } = form;
  const { tagsByCategory, isLoadingTags } = useProfileTags();

  // Get specialty skills for dropdown
  const specialtySkills = tagsByCategory.specialty_skill || [];
  const coreDisciplines = tagsByCategory.core_discipline || [];
  const projectTypes = tagsByCategory.project_type || [];

  // Watch current values
  const availableFor = watch('available_for') || [];
  const workStyle = watch('work_style') || [];
  const selectedSkills = watch('skills') || [];
  const selectedCoreDisciplines = watch('core_disciplines') || [];
  const selectedProjectTypes = watch('project_types') || [];
  const selectedAwards = watch('awards') || [];
  const rateType = watch('rate_type');
  const minRate = watch('rate_min');
  const maxRate = watch('rate_max');

  if (isLoadingTags) {
    return (
      <div className="space-y-6">
        <Card className="bg-white/5 border-white/10">
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-white/10 rounded w-1/3"></div>
              <div className="h-8 bg-white/10 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      {/* Work Preferences */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Work Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormFieldGroup
            fields={gigSeekerWorkPreferencesFields}
            form={form}
            columns={1}
          />
          
          <MultiSelectPills
            label="Available For"
            options={AVAILABLE_FOR_OPTIONS}
            selectedOptions={availableFor}
            onChange={(selected) => setValue('available_for', selected)}
            description="Types of engagements you're open to"
          />
          
          <MultiSelectPills
            label="Work Style"
            options={WORK_STYLE_OPTIONS}
            selectedOptions={workStyle}
            onChange={(selected) => setValue('work_style', selected)}
            description="Your preferred working arrangements"
          />
        </CardContent>
      </Card>

      {/* Core Disciplines */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Core Disciplines</CardTitle>
        </CardHeader>
        <CardContent>
          <MultiSelectPills
            label="Your Core Disciplines"
            options={coreDisciplines.map(tag => tag.name)}
            selectedOptions={selectedCoreDisciplines}
            onChange={(selected) => setValue('core_disciplines', selected)}
            description="Primary areas of expertise"
          />
        </CardContent>
      </Card>

      {/* Project Types */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Project Types</CardTitle>
        </CardHeader>
        <CardContent>
          <MultiSelectPills
            label="Preferred Project Types"
            options={projectTypes.map(tag => tag.name)}
            selectedOptions={selectedProjectTypes}
            onChange={(selected) => setValue('project_types', selected)}
            description="Types of projects you enjoy working on"
          />
        </CardContent>
      </Card>

      {/* Rate & Experience */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Rate & Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <RateSelector
            rateType={rateType}
            onRateTypeChange={(type) => setValue('rate_type', type)}
            minRate={minRate}
            maxRate={maxRate}
            onMinRateChange={(value) => setValue('rate_min', value)}
            onMaxRateChange={(value) => setValue('rate_max', value)}
          />
          
          <MultiSelectPills
            label="Skills"
            options={specialtySkills.map(tag => tag.name)}
            selectedOptions={selectedSkills}
            onChange={(selected) => setValue('skills', selected)}
            description="Your technical and creative skills"
          />
        </CardContent>
      </Card>

      {/* Awards & Accolades */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Awards & Accolades</CardTitle>
        </CardHeader>
        <CardContent>
          <AwardsSelector
            selectedAwards={selectedAwards}
            onChange={(awards) => setValue('awards', awards)}
          />
        </CardContent>
      </Card>
    </>
  );
}
