
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Pill } from '@/components/ui/pill';
import { Button } from '@/components/ui/button';
import { Plus, X } from 'lucide-react';

interface MultiSelectPillsProps {
  label: string;
  options: string[];
  selectedOptions: string[];
  onChange: (selected: string[]) => void;
  maxSelections?: number;
  description?: string;
  placeholder?: string;
}

export function MultiSelectPills({
  label,
  options,
  selectedOptions,
  onChange,
  maxSelections,
  description,
  placeholder = "Select options"
}: MultiSelectPillsProps) {
  const [showAll, setShowAll] = useState(false);
  
  const toggleOption = (option: string) => {
    if (selectedOptions.includes(option)) {
      onChange(selectedOptions.filter(o => o !== option));
    } else if (!maxSelections || selectedOptions.length < maxSelections) {
      onChange([...selectedOptions, option]);
    }
  };

  const displayOptions = showAll ? options : options.slice(0, 12);
  const hasMore = options.length > 12;

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-white text-sm font-medium">{label}</Label>
        {description && (
          <p className="text-white/50 text-xs mt-1">{description}</p>
        )}
        {maxSelections && (
          <p className="text-white/40 text-xs mt-1">
            {selectedOptions.length}/{maxSelections} selected
          </p>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {displayOptions.map((option) => {
          const isSelected = selectedOptions.includes(option);
          const isDisabled = !isSelected && maxSelections && selectedOptions.length >= maxSelections;
          
          return (
            <Pill
              key={option}
              variant={isSelected ? "primary" : "default"}
              className={`cursor-pointer transition-all ${
                isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
              }`}
              onClick={() => !isDisabled && toggleOption(option)}
            >
              {option}
              {isSelected && <X className="w-3 h-3 ml-1" />}
            </Pill>
          );
        })}
      </div>
      
      {hasMore && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          className="text-white/70 hover:text-white"
        >
          {showAll ? 'Show Less' : `Show ${options.length - 12} More`}
        </Button>
      )}
    </div>
  );
}
