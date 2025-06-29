
import { useState, useCallback } from 'react';
import { UserRole } from '@/types/auth';
import { getOnboardingConfig } from '@/lib/onboarding/onboardingConfig';

interface UseOnboardingProgressProps {
  userRole: UserRole;
  initialStep?: number;
}

export function useOnboardingProgress({ userRole, initialStep = 1 }: UseOnboardingProgressProps) {
  const config = getOnboardingConfig(userRole);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [stepData, setStepData] = useState<Record<number, any>>({});

  const markStepComplete = useCallback((step: number, data?: any) => {
    setCompletedSteps(prev => new Set([...prev, step]));
    if (data) {
      setStepData(prev => ({ ...prev, [step]: data }));
    }
  }, []);

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= config.totalSteps) {
      setCurrentStep(step);
    }
  }, [config.totalSteps]);

  const goToNextStep = useCallback(() => {
    if (currentStep < config.totalSteps) {
      markStepComplete(currentStep);
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, config.totalSteps, markStepComplete]);

  const goToPreviousStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const isStepComplete = useCallback((step: number) => {
    return completedSteps.has(step);
  }, [completedSteps]);

  const canGoToStep = useCallback((step: number) => {
    // Can always go backwards
    if (step <= currentStep) return true;
    
    // Can go forward only if all previous steps are complete
    for (let i = 1; i < step; i++) {
      if (!completedSteps.has(i)) return false;
    }
    return true;
  }, [currentStep, completedSteps]);

  const getProgressPercentage = useCallback(() => {
    return Math.round((completedSteps.size / config.totalSteps) * 100);
  }, [completedSteps.size, config.totalSteps]);

  const getCurrentStepConfig = useCallback(() => {
    return config.steps[currentStep - 1];
  }, [config.steps, currentStep]);

  const getAllStepData = useCallback(() => {
    return stepData;
  }, [stepData]);

  return {
    currentStep,
    totalSteps: config.totalSteps,
    completedSteps: Array.from(completedSteps),
    stepData,
    markStepComplete,
    goToStep,
    goToNextStep,
    goToPreviousStep,
    isStepComplete,
    canGoToStep,
    getProgressPercentage,
    getCurrentStepConfig,
    getAllStepData,
    config
  };
}
