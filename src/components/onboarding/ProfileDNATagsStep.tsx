
import { useState } from 'react';
import { ProfileTagSelector } from '@/components/profile/ProfileTagSelector';
import { Button, Card, Heading, Text } from '@/components/ui/design-primitives';
import { TagCategory } from '@/types/profile-tags';
import { UserRole } from '@/types/auth';
import { useUserProfileTags } from '@/hooks/useProfileTags';
import { LoadingSpinner } from '@/components/ui/design-primitives';

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
      }
    } else {
      switch (category) {
        case 'core_discipline': return 'Your Core Disciplines';
        case 'specialty_skill': return 'Your Specialty Skills';
        case 'project_type': return 'Project Types You Work On';
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
      <Card padding="lg" className="max-w-2xl mx-auto">
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <LoadingSpinner size="lg" />
          <Text variant="secondary">Loading your profile tags...</Text>
        </div>
      </Card>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Progress indicator */}
      <div className="flex justify-center space-x-2">
        {categories.map((category, index) => (
          <div
            key={category}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              index <= currentCategoryIndex 
                ? 'bg-white' 
                : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Category header */}
      <Card padding="lg" className="text-center">
        <Heading as="h2" size="xl" className="mb-2">
          {getCategoryLabel(currentCategory)}
        </Heading>
        <Text variant="secondary" size="lg">
          Step {currentCategoryIndex + 1} of {categories.length}
        </Text>
      </Card>

      {/* Tag selector */}
      <ProfileTagSelector
        userId={userId}
        category={currentCategory}
        userRole={userRole}
        onComplete={() => {}} // Handle completion through our custom buttons
      />

      {/* Navigation buttons */}
      <div className="flex justify-between items-center">
        <Button
          variant="secondary"
          size="lg"
          onClick={handleBack}
        >
          {isFirstCategory ? 'Back to Profile' : 'Previous'}
        </Button>
        
        <Button
          variant="primary"
          size="lg"
          onClick={handleNext}
          disabled={!hasMinimumTags()}
        >
          {isLastCategory ? 'Continue' : 'Next Category'}
        </Button>
      </div>

      {/* Help text for required fields */}
      {currentCategory === 'core_discipline' && !hasMinimumTags() && (
        <div className="text-center">
          <Text size="sm" className="text-red-400">
            Please select at least 1 core discipline to continue
          </Text>
        </div>
      )}
    </div>
  );
}
