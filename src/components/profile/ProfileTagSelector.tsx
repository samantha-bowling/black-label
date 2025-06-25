
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAvailableTags, useUserProfileTags, useToggleUserTag } from '@/hooks/useProfileTags';
import { TagCategory, TAG_SELECTION_LIMITS, TAG_CATEGORY_DESCRIPTIONS, POSTER_TAG_CATEGORY_DESCRIPTIONS } from '@/types/profile-tags';
import { UserRole } from '@/types/auth';
import { toast } from 'sonner';
import { CheckIcon, XIcon } from 'lucide-react';

interface ProfileTagSelectorProps {
  userId: string;
  category: TagCategory;
  userRole?: UserRole;
  onComplete?: () => void;
}

export function ProfileTagSelector({ 
  userId, 
  category, 
  userRole = 'gig_seeker',
  onComplete 
}: ProfileTagSelectorProps) {
  const { data: availableTags, isLoading: isLoadingAvailable } = useAvailableTags(category);
  const { userTagsByCategory, isLoadingUserTags } = useUserProfileTags(userId);
  const toggleUserTag = useToggleUserTag();
  const [optimisticSelections, setOptimisticSelections] = useState<string[]>([]);

  const userTags = userTagsByCategory[category] || [];
  const selectedTagIds = userTags.map(ut => ut.tag_id);
  const limits = TAG_SELECTION_LIMITS[category];
  const descriptions = userRole === 'gig_poster' ? POSTER_TAG_CATEGORY_DESCRIPTIONS : TAG_CATEGORY_DESCRIPTIONS;

  // Initialize optimistic selections
  useEffect(() => {
    setOptimisticSelections(selectedTagIds);
  }, [selectedTagIds.join(',')]);

  const handleTagToggle = async (tagId: string) => {
    const isCurrentlySelected = optimisticSelections.includes(tagId);
    const newSelections = isCurrentlySelected
      ? optimisticSelections.filter(id => id !== tagId)
      : [...optimisticSelections, tagId];

    // Check limits before proceeding
    if (!isCurrentlySelected && newSelections.length > limits.max) {
      toast.error(`You can select a maximum of ${limits.max} ${category.replace(/_/g, ' ')} tags`);
      return;
    }

    // Optimistic update
    setOptimisticSelections(newSelections);

    try {
      await toggleUserTag.mutateAsync({
        userId,
        tagId,
        isSelected: !isCurrentlySelected
      });

      // Success feedback
      const tag = availableTags?.find(t => t.id === tagId);
      if (tag) {
        toast.success(
          isCurrentlySelected 
            ? `Removed "${tag.name}" from your profile`
            : `Added "${tag.name}" to your profile`
        );
      }
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticSelections(optimisticSelections);
      
      console.error('Error toggling tag:', error);
      toast.error('Failed to update tag selection. Please try again.');
    }
  };

  const getSelectionStatus = () => {
    const currentCount = optimisticSelections.length;
    const { min, max } = limits;

    if (currentCount === 0 && min > 0) {
      return { 
        message: `Select at least ${min} ${category.replace(/_/g, ' ')} tag${min > 1 ? 's' : ''}`,
        type: 'required' as const
      };
    }

    if (currentCount < min) {
      return { 
        message: `Select ${min - currentCount} more ${category.replace(/_/g, ' ')} tag${min - currentCount > 1 ? 's' : ''}`,
        type: 'incomplete' as const
      };
    }

    if (currentCount >= min && currentCount <= max) {
      return { 
        message: `${currentCount}/${max} selected`,
        type: 'valid' as const
      };
    }

    return { 
      message: `Too many selected (${currentCount}/${max})`,
      type: 'overflow' as const
    };
  };

  if (isLoadingAvailable || isLoadingUserTags) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="grid grid-cols-2 gap-2">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="h-8 bg-muted rounded" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const status = getSelectionStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {category.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ')}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          {descriptions[category]}
        </p>
        <div className="flex items-center justify-between">
          <span className={`text-sm font-medium ${
            status.type === 'required' || status.type === 'incomplete' 
              ? 'text-orange-500'
              : status.type === 'overflow'
              ? 'text-destructive'
              : 'text-primary'
          }`}>
            {status.message}
          </span>
          <span className="text-xs text-muted-foreground">
            Limit: {limits.min}-{limits.max}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {availableTags?.map((tag) => {
            const isSelected = optimisticSelections.includes(tag.id);
            const isDisabled = !isSelected && optimisticSelections.length >= limits.max;
            
            return (
              <Button
                key={tag.id}
                variant={isSelected ? "default" : "outline"}
                size="sm"
                onClick={() => handleTagToggle(tag.id)}
                disabled={isDisabled || toggleUserTag.isPending}
                className={`justify-between h-auto p-3 text-left ${
                  isSelected 
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                    : 'hover:bg-muted'
                } ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">{tag.name}</div>
                  {tag.description && (
                    <div className="text-xs opacity-70 mt-1">{tag.description}</div>
                  )}
                </div>
                <div className="ml-2 flex-shrink-0">
                  {isSelected ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    <div className="h-4 w-4" />
                  )}
                </div>
              </Button>
            );
          })}
        </div>

        {optimisticSelections.length > 0 && (
          <>
            <Separator />
            <div>
              <h4 className="text-sm font-medium mb-2">Selected Tags:</h4>
              <div className="flex flex-wrap gap-2">
                {optimisticSelections.map((tagId) => {
                  const tag = availableTags?.find(t => t.id === tagId);
                  if (!tag) return null;
                  
                  return (
                    <Badge
                      key={tagId}
                      variant="secondary"
                      className="cursor-pointer hover:bg-destructive hover:text-destructive-foreground transition-colors"
                      onClick={() => handleTagToggle(tagId)}
                    >
                      {tag.name}
                      <XIcon className="h-3 w-3 ml-1" />
                    </Badge>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
