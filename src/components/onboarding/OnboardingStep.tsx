
import { ReactNode } from 'react';
import { CardLuxe, HeadingLG } from '@/components/ui/primitives';

interface OnboardingStepProps {
  title: string;
  description?: string;
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
}

export function OnboardingStep({ 
  title, 
  description, 
  children, 
  currentStep, 
  totalSteps 
}: OnboardingStepProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Progress indicator */}
        <div className="flex items-center justify-center space-x-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full ${
                index + 1 <= currentStep 
                  ? 'bg-white' 
                  : 'bg-white/30'
              }`}
            />
          ))}
        </div>

        {/* Header */}
        <div className="text-center space-y-4">
          <HeadingLG className="text-white">
            {title}
          </HeadingLG>
          {description && (
            <p className="text-white/80 text-lg">
              {description}
            </p>
          )}
        </div>

        {/* Content */}
        <CardLuxe className="p-8">
          {children}
        </CardLuxe>
      </div>
    </div>
  );
}
