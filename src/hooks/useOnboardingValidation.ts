
import { useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { 
  validateRateRange, 
  validateBudgetRange, 
  validateProjectShowcase 
} from '@/lib/validation/onboardingValidation';
import { UserRole } from '@/types/auth';

interface UseOnboardingValidationProps {
  form: UseFormReturn<any>;
  userRole: UserRole;
}

export function useOnboardingValidation({ form, userRole }: UseOnboardingValidationProps) {
  const { setError, clearErrors, watch } = form;

  const validateCrossFieldRules = useCallback(() => {
    const formData = watch();
    let hasErrors = false;

    // Clear previous cross-field errors
    clearErrors(['rate_range_min', 'rate_range_max', 'typical_budget_min', 'typical_budget_max', 'project_showcase']);

    if (userRole === 'gig_seeker') {
      // Validate rate range
      const rateError = validateRateRange(formData.rate_range_min, formData.rate_range_max);
      if (rateError) {
        setError('rate_range_max', { message: rateError });
        hasErrors = true;
      }

      // Validate project showcase
      if (formData.project_showcase) {
        const projectError = validateProjectShowcase(formData.project_showcase);
        if (projectError) {
          setError('project_showcase', { message: projectError });
          hasErrors = true;
        }
      }
    }

    if (userRole === 'gig_poster') {
      // Validate budget range
      const budgetError = validateBudgetRange(formData.typical_budget_min, formData.typical_budget_max);
      if (budgetError) {
        setError('typical_budget_max', { message: budgetError });
        hasErrors = true;
      }
    }

    return !hasErrors;
  }, [form, userRole, setError, clearErrors, watch]);

  const validateStep = useCallback((stepData: any) => {
    return validateCrossFieldRules();
  }, [validateCrossFieldRules]);

  return {
    validateCrossFieldRules,
    validateStep
  };
}
