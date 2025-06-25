
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useProfileTags, useUserProfileTags } from '@/hooks/useProfileTags';
import { 
  TagCategory, 
  TAG_SELECTION_LIMITS, 
  TAG_CATEGORY_LABELS, 
  TAG_CATEGORY_DESCRIPTIONS,
  POSTER_TAG_CATEGORY_LABELS,
  POSTER_TAG_CATEGORY_DESCRIPTIONS 
} from '@/types/profile-tags';
import { UserRole } from '@/types/auth';

interface ProfileTagSelectorProps {
  userId: string;
  category: TagCategory;
  userRole?: UserRole;
  onComplete?: () => void;
}

export function ProfileTagSelector({ userId, category, userRole = 'gig_seeker', onComplete }: ProfileTagSelectorProps) {
  const { tagsByCategory, isLoadingTags } = useProfileTags();
  const { userTagsByCategory, updateUserTags, isUpdatingTags } = useUserProfileTags(userId);

  const availableTags = tagsByCategory[category] || [];
  const selectedUserTags = userTagsByCategory[category] || [];
  const selectedTagIds = selectedUserTags.map(ut => ut.tag_id);

  const [localSelection, setLocalSelection] = useState<string[]>(selectedTagIds);

  const limits = TAG_SELECTION_LIMITS[category];
  const canSelectMore = localSelection.length < limits.max;
  const hasMinimumSelected = localSelection.length >= limits.min;

  // Use role-specific labels and descriptions
  const isGigPoster = userRole === 'gig_poster';
  const categoryLabels = isGigPoster ? POSTER_TAG_CATEGORY_LABELS : TAG_CATEGORY_LABELS;
  const categoryDescriptions = isGigPoster ? POSTER_TAG_CATEGORY_DESCRIPTIONS : TAG_CATEGORY_DESCRIPTIONS;

  // Professional context helper text
  const getHelperText = (category: TagCategory) => {
    switch (category) {
      case 'core_discipline':
        return isGigPoster 
          ? 'Select the primary disciplines you typically need for projects'
          : 'Think of this as your "job lane" - roles that would appear on a credits screen';
      case 'specialty_skill':
        return 'These give texture and flavor to your role - your unique expertise areas';
      case 'project_type':
        return 'Project archetypes that describe the scale and context where you operate';
      default:
        return '';
    }
  };

  const handleTagToggle = (tagId: string) => {
    setLocalSelection(prev => {
      if (prev.includes(tagId)) {
        return prev.filter(id => id !== tagId);
      } else if (canSelectMore) {
        return [...prev, tagId];
      }
      return prev;
    });
  };

  const handleSave = () => {
    console.log(`Saving tags for category ${category}:`, localSelection);
    updateUserTags({ tagIds: localSelection, category });
    onComplete?.();
  };

  const handleReset = () => {
    console.log(`Resetting tags for category ${category}`);
    setLocalSelection(selectedTagIds);
  };

  // Update local selection when user tags change (after successful save)
  React.useEffect(() => {
    const newSelectedIds = selectedUserTags.map(ut => ut.tag_id);
    if (JSON.stringify(newSelectedIds) !== JSON.stringify(localSelection)) {
      setLocalSelection(newSelectedIds);
    }
  }, [selectedUserTags]);

  if (isLoadingTags) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-8 bg-muted rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {categoryLabels[category]}
          <Badge variant="outline">
            {localSelection.length}/{limits.max}
          </Badge>
        </CardTitle>
        <CardDescription className="space-y-2">
          <div>{categoryDescriptions[category]}</div>
          <div className="text-sm text-muted-foreground italic">
            {getHelperText(category)}
          </div>
          {limits.min > 0 && (
            <div className="text-sm font-medium">
              Select {limits.min === limits.max ? limits.min : `${limits.min}-${limits.max}`} {
                category === 'core_discipline' ? 'disciplines' : 'options'
              }
            </div>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {availableTags.map((tag) => {
            const isSelected = localSelection.includes(tag.id);
            const canToggle = isSelected || canSelectMore;

            return (
              <div
                key={tag.id}
                className={`flex items-center space-x-2 p-3 rounded-lg border transition-colors ${
                  isSelected 
                    ? 'bg-primary/10 border-primary' 
                    : 'bg-muted/30 border-muted hover:bg-muted/50'
                } ${!canToggle ? 'opacity-50' : 'cursor-pointer'}`}
                onClick={() => canToggle && handleTagToggle(tag.id)}
              >
                <Checkbox
                  id={tag.id}
                  checked={isSelected}
                  disabled={!canToggle}
                  onChange={() => {}} // Handled by parent click
                />
                <label
                  htmlFor={tag.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                >
                  {tag.name}
                  {tag.description && (
                    <div className="text-xs text-muted-foreground mt-1">
                      {tag.description}
                    </div>
                  )}
                </label>
              </div>
            );
          })}
        </div>

        {!canSelectMore && limits.max > 0 && (
          <div className="text-sm text-amber-600">
            Maximum {limits.max} selections reached. Unselect others to choose different options.
          </div>
        )}

        {!hasMinimumSelected && limits.min > 0 && (
          <div className="text-sm text-destructive">
            Please select at least {limits.min} {category === 'core_discipline' ? 'core disciplines' : 'options'}.
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button
            variant="outline"
            onClick={handleReset}
            disabled={isUpdatingTags}
          >
            Reset
          </Button>
          <Button
            onClick={handleSave}
            disabled={!hasMinimumSelected || isUpdatingTags}
          >
            {isUpdatingTags ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
