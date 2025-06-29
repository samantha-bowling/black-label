
import { Check, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface OnboardingProgressIndicatorProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  stepTitles: string[];
  onStepClick?: (step: number) => void;
  canNavigate?: boolean;
}

export function OnboardingProgressIndicator({
  currentStep,
  totalSteps,
  completedSteps,
  stepTitles,
  onStepClick,
  canNavigate = false
}: OnboardingProgressIndicatorProps) {
  const isStepComplete = (step: number) => completedSteps.includes(step);
  const isStepCurrent = (step: number) => step === currentStep;
  const isStepClickable = (step: number) => canNavigate && onStepClick && (step <= currentStep || isStepComplete(step));

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-white/20">
          <div 
            className="h-full bg-white transition-all duration-300 ease-out"
            style={{ 
              width: `${(completedSteps.length / totalSteps) * 100}%` 
            }}
          />
        </div>

        {/* Step indicators */}
        {Array.from({ length: totalSteps }, (_, index) => {
          const step = index + 1;
          const completed = isStepComplete(step);
          const current = isStepCurrent(step);
          const clickable = isStepClickable(step);

          return (
            <div key={step} className="flex flex-col items-center relative z-10">
              <button
                onClick={clickable ? () => onStepClick!(step) : undefined}
                disabled={!clickable}
                className={cn(
                  "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                  "bg-black", // Always black background
                  {
                    "border-white text-white": current,
                    "border-white/50 text-white/50": !current && !completed,
                    "border-white text-white": completed,
                    "cursor-pointer hover:scale-110": clickable,
                    "cursor-default": !clickable
                  }
                )}
                aria-label={`Step ${step}: ${stepTitles[index] || `Step ${step}`}`}
              >
                {completed ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Circle className={cn("w-3 h-3", current ? "fill-current" : "")} />
                )}
              </button>
              
              {stepTitles[index] && (
                <span className={cn(
                  "text-xs mt-2 text-center max-w-20 leading-tight",
                  {
                    "text-white font-medium": current,
                    "text-white/70": !current && completed,
                    "text-white/50": !current && !completed
                  }
                )}>
                  {stepTitles[index]}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Progress text */}
      <div className="text-center mt-4">
        <span className="text-white/70 text-sm">
          Step {currentStep} of {totalSteps} • {Math.round((completedSteps.length / totalSteps) * 100)}% Complete
        </span>
      </div>
    </div>
  );
}
