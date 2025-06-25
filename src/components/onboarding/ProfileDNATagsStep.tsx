
import { useState } from 'react';
import { ProfileTagSelector } from '@/components/profile/ProfileTagSelector';
import { ButtonPrimary } from '@/components/ui/primitives';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TagCategory } from '@/types/profile-tags';
import { UserRole } from '@/types/auth';
import { useUserProfileTags } from '@/hooks/useProfileTags';

interface ProfileDNATagsStepProps {
  userId: string;
  userRole: UserRole;
  onNext: () => void;
  onBack: () => void;
}

export function ProfileDNATagsStep({ userId, userRole, onNext, onBack }: ProfileDNATagsStepProps) {
  const [currentCategory, setCurrentCategory] = useState<TagCategory>('core_discipline');
  const { userTagsByCategory, isLoadingUserTags } = useUserProfileTags(userId);

  const categories: TagCategory[] = ['core_discipline', 'specialty_skill', 'project_type'];
  
  // Role-specific category labels for step progression
  const getCategoryLabel = (category: TagCategory): string => {
    if (userRole === 'gig_poster') {
      switch (category) {
        case 'core_discipline': return 'Disciplines You Need';
        case 'specialty_skill': return 'Skills You Require';
        case 'project_type': return 'Your Project Types';
        default: return category.replace(/_/g, ' ');
      }
    } else {
      switch (category) {
        case 'core_discipline': return 'Your Core Disciplines';
        case 'specialty_skill': return 'Your Specialty Skills';
        case 'project_type': return 'Project Types You Work On';
        default: return category.replace(/_/g, ' ');
      }
    }
  };

  const currentCategoryIndex = categories.indexOf(currentCategory);
  const isLastCategory = currentCategoryIndex === categories.length - 1;
  const isFirstCategory = currentCategoryIndex === 0;

  // Check if minimum requirements are met for current category
  const hasMinimumTags = () => {
    if (currentCategory === 'core_discipline') {
      const coreTags = userTagsByCategory[currentCategory] || [];
      return coreTags.length >= 1; // Minimum 1 core discipline required
    }
    return true; // Other categories are optional
  };

  const handleNext = () => {
    if (isLastCategory) {
      onNext(); // Go to next onboarding step
    } else {
      setCurrentCategory(categories[currentCategoryIndex + 1]);
    }
  };

  const handleBack = () => {
    if (isFirstCategory) {
      onBack(); // Go to previous onboarding step
    } else {
      setCurrentCategory(categories[currentCategoryIndex - 1]);
    }
  };

  if (isLoadingUserTags) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-muted rounded w-1/3" />
            <div className="space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex justify-center space-x-2 mb-6">
        {categories.map((category, index) => (
          <div
            key={category}
            className={`w-3 h-3 rounded-full transition-colors ${
              index <= currentCategoryIndex 
                ? 'bg-primary' 
                : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Category header */}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-white">
            {getCategoryLabel(currentCategory)}
          </CardTitle>
          <p className="text-white/70">
            Step {currentCategoryIndex + 1} of {categories.length}
          </p>
        </CardHeader>
      </Card>

      {/* Tag selector */}
      <ProfileTagSelector
        userId={userId}
        category={currentCategory}
        userRole={userRole}
        onComplete={() => {}} // Handle completion through our custom buttons
      />

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <ButtonPrimary
          type="button"
          onClick={handleBack}
          size="lg"
          className="bg-white/10 hover:bg-white/20"
        >
          {isFirstCategory ? 'Back to Profile' : 'Previous'}
        </ButtonPrimary>
        <ButtonPrimary
          type="button"
          onClick={handleNext}
          size="lg"
          disabled={!hasMinimumTags()}
        >
          {isLastCategory ? 'Continue' : 'Next Category'}
        </ButtonPrimary>
      </div>

      {/* Help text for required fields */}
      {currentCategory === 'core_discipline' && !hasMinimumTags() && (
        <div className="text-center text-destructive text-sm">
          Please select at least 1 core discipline to continue
        </div>
      )}
    </div>
  );
}
