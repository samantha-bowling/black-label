
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { InputLuxe } from '@/components/ui/primitives';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const SKILL_OPTIONS = [
  'Game Design', 'Programming', '3D Modeling', '2D Art', 'Animation',
  'UI/UX Design', 'Sound Design', 'Music Composition', 'QA Testing',
  'Project Management', 'Marketing', 'Writing', 'Voice Acting'
];

const GIG_TYPE_OPTIONS = [
  'Full-time', 'Part-time', 'Contract', 'Freelance', 'Remote', 'On-site'
];

interface GigSeekerFieldsProps {
  form: UseFormReturn<any>;
}

export function GigSeekerFields({ form }: GigSeekerFieldsProps) {
  const { register, setValue, watch, formState: { errors } } = form;
  const selectedSkills = watch('skills') || [];
  const selectedGigTypes = watch('desired_gig_types') || [];

  const toggleSkill = (skill: string) => {
    const updatedSkills = selectedSkills.includes(skill)
      ? selectedSkills.filter((s: string) => s !== skill)
      : [...selectedSkills, skill];
    setValue('skills', updatedSkills);
  };

  const toggleGigType = (gigType: string) => {
    const updatedTypes = selectedGigTypes.includes(gigType)
      ? selectedGigTypes.filter((t: string) => t !== gigType)
      : [...selectedGigTypes, gigType];
    setValue('desired_gig_types', updatedTypes);
  };

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-white mb-3 block">
          Skills & Expertise *
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {SKILL_OPTIONS.map((skill) => (
            <div key={skill} className="flex items-center space-x-2">
              <Checkbox
                id={skill}
                checked={selectedSkills.includes(skill)}
                onCheckedChange={() => toggleSkill(skill)}
              />
              <Label
                htmlFor={skill}
                className="text-white/80 text-sm cursor-pointer"
              >
                {skill}
              </Label>
            </div>
          ))}
        </div>
      </div>

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

      <div>
        <Label htmlFor="availability_status" className="text-white">
          Availability Status
        </Label>
        <Select onValueChange={(value) => setValue('availability_status', value)}>
          <SelectTrigger className="bg-black/20 border-white/20 text-white">
            <SelectValue placeholder="Select your availability" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="open">Open to offers</SelectItem>
            <SelectItem value="selective">Selective about offers</SelectItem>
            <SelectItem value="not-looking">Not currently looking</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="past_credits" className="text-white">
          Past Credits & Experience
        </Label>
        <Textarea
          id="past_credits"
          {...register('past_credits')}
          placeholder="List your notable projects, games you've worked on, or relevant experience..."
          className="min-h-[120px] bg-black/20 border-white/20 text-white placeholder:text-white/50"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="rate_range_min" className="text-white">
            Rate Range ($/hour) - Min
          </Label>
          <InputLuxe
            id="rate_range_min"
            type="number"
            {...register('rate_range_min', { valueAsNumber: true })}
            placeholder="25"
          />
        </div>
        <div>
          <Label htmlFor="rate_range_max" className="text-white">
            Rate Range ($/hour) - Max
          </Label>
          <InputLuxe
            id="rate_range_max"
            type="number"
            {...register('rate_range_max', { valueAsNumber: true })}
            placeholder="75"
          />
        </div>
      </div>
    </div>
  );
}
