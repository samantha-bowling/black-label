
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { InputLuxe } from '@/components/ui/primitives';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

const GIG_TYPE_OPTIONS = [
  'Full-time', 'Part-time', 'Contract', 'Freelance', 'Remote', 'On-site'
];

interface GigSeekerFieldsProps {
  form: UseFormReturn<any>;
}

export function GigSeekerFields({ form }: GigSeekerFieldsProps) {
  const { register, setValue, watch, formState: { errors } } = form;
  const selectedGigTypes = watch('desired_gig_types') || [];

  const toggleGigType = (gigType: string) => {
    const updatedTypes = selectedGigTypes.includes(gigType)
      ? selectedGigTypes.filter((t: string) => t !== gigType)
      : [...selectedGigTypes, gigType];
    setValue('desired_gig_types', updatedTypes);
  };

  return (
    <div className="space-y-6">
      {/* Professional Story Section */}
      <Card className="bg-black/20 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span>Professional Story</span>
            <Info className="w-4 h-4 text-white/50" />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="past_credits" className="text-white">
              Notable Projects & Accomplishments
            </Label>
            <Textarea
              id="past_credits"
              {...register('past_credits')}
              placeholder="Share your standout projects, games you've shipped, notable achievements, or impactful work that demonstrates your expertise..."
              className="min-h-[120px] bg-black/20 border-white/20 text-white placeholder:text-white/50"
            />
            <p className="text-white/50 text-xs mt-1">
              Focus on outcomes and impact rather than just responsibilities
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Work Preferences Section */}
      <Card className="bg-black/20 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Work Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>

      {/* Rate Information Section - Made Optional and Private */}
      <Card className="bg-black/20 border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <span>Rate Information</span>
            <span className="text-xs bg-white/10 px-2 py-1 rounded-full">Optional & Private</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-blue-300 font-medium">Rate information is private by default</p>
                <p className="text-blue-200/80 mt-1">
                  This information is only shared with verified project posters after mutual interest is established.
                  Your public profile focuses on your accomplishments and expertise.
                </p>
              </div>
            </div>
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
        </CardContent>
      </Card>
    </div>
  );
}
