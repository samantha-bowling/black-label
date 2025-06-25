
import { UseFormReturn } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { InputLuxe } from '@/components/ui/primitives';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';

interface GigPosterFieldsProps {
  form: UseFormReturn<any>;
}

export function GigPosterFields({ form }: GigPosterFieldsProps) {
  const { register, setValue, watch } = form;
  const ndaRequired = watch('nda_required');

  return (
    <div className="space-y-6">
      <div>
        <Label htmlFor="company_name" className="text-white">
          Company/Studio Name
        </Label>
        <InputLuxe
          id="company_name"
          {...register('company_name')}
          placeholder="Your company or studio name"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="typical_budget_min" className="text-white">
            Typical Budget Range ($) - Min
          </Label>
          <InputLuxe
            id="typical_budget_min"
            type="number"
            {...register('typical_budget_min', { valueAsNumber: true })}
            placeholder="1000"
          />
        </div>
        <div>
          <Label htmlFor="typical_budget_max" className="text-white">
            Typical Budget Range ($) - Max
          </Label>
          <InputLuxe
            id="typical_budget_max"
            type="number"
            {...register('typical_budget_max', { valueAsNumber: true })}
            placeholder="10000"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="timeline_expectations" className="text-white">
          Timeline Expectations
        </Label>
        <Textarea
          id="timeline_expectations"
          {...register('timeline_expectations')}
          placeholder="Describe your typical project timelines and expectations..."
          className="min-h-[100px] bg-black/20 border-white/20 text-white placeholder:text-white/50"
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="nda_required"
          checked={ndaRequired}
          onCheckedChange={(checked) => setValue('nda_required', checked)}
        />
        <Label htmlFor="nda_required" className="text-white cursor-pointer">
          I typically require NDAs for my projects
        </Label>
      </div>
    </div>
  );
}
