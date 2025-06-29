
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { InputLuxe } from '@/components/ui/primitives';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface RateSelectorProps {
  rateType: 'hourly' | 'project' | 'salary' | null;
  onRateTypeChange: (type: 'hourly' | 'project' | 'salary' | null) => void;
  minRate: number | undefined;
  maxRate: number | undefined;
  onMinRateChange: (value: number | undefined) => void;
  onMaxRateChange: (value: number | undefined) => void;
}

export function RateSelector({
  rateType,
  onRateTypeChange,
  minRate,
  maxRate,
  onMinRateChange,
  onMaxRateChange
}: RateSelectorProps) {
  const getRateLabel = () => {
    switch (rateType) {
      case 'hourly': return 'Hourly Rate ($)';
      case 'project': return 'Project Rate ($)';
      case 'salary': return 'Annual Salary ($)';
      default: return 'Rate Range ($)';
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-white text-sm font-medium mb-3 block">Rate Type (Optional)</Label>
        <RadioGroup
          value={rateType || ''}
          onValueChange={(value) => onRateTypeChange(value as any || null)}
          className="flex flex-wrap gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="" id="none" />
            <Label htmlFor="none" className="text-white/70 cursor-pointer">None</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hourly" id="hourly" />
            <Label htmlFor="hourly" className="text-white/70 cursor-pointer">Hourly</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="project" id="project" />
            <Label htmlFor="project" className="text-white/70 cursor-pointer">Project</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="salary" id="salary" />
            <Label htmlFor="salary" className="text-white/70 cursor-pointer">Full-time</Label>
          </div>
        </RadioGroup>
      </div>

      {rateType && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="min-rate" className="text-white text-sm">
              {getRateLabel()} - Min
            </Label>
            <InputLuxe
              id="min-rate"
              type="number"
              value={minRate || ''}
              onChange={(e) => onMinRateChange(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Min"
            />
          </div>
          <div>
            <Label htmlFor="max-rate" className="text-white text-sm">
              {getRateLabel()} - Max
            </Label>
            <InputLuxe
              id="max-rate"
              type="number"
              value={maxRate || ''}
              onChange={(e) => onMaxRateChange(e.target.value ? Number(e.target.value) : undefined)}
              placeholder="Max"
            />
          </div>
        </div>
      )}
    </div>
  );
}
