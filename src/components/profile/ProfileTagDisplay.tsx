
import { Pill } from '@/components/ui/pill';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';
import { useUserProfileTags } from '@/hooks/useProfileTags';
import { TagCategory, TAG_CATEGORY_LABELS } from '@/types/profile-tags';

interface ProfileTagDisplayProps {
  userId: string;
  categories?: TagCategory[];
  compact?: boolean;
}

export function ProfileTagDisplay({ 
  userId, 
  categories = ['core_discipline', 'specialty_skill', 'project_type'],
  compact = false 
}: ProfileTagDisplayProps) {
  const { userTagsByCategory, isLoadingUserTags } = useUserProfileTags(userId);

  if (isLoadingUserTags) {
    return (
      <div className="space-y-4">
        {categories.map((category) => (
          <Card key={category}>
            <CardContent className="p-4">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-muted rounded w-1/3" />
                <div className="flex gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-6 bg-muted rounded w-20" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const hasAnyTags = categories.some(category => 
    userTagsByCategory[category] && userTagsByCategory[category].length > 0
  );

  if (!hasAnyTags) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          No profile tags selected yet.
        </CardContent>
      </Card>
    );
  }

  if (compact) {
    // Compact view - show all tags in one section
    const allTags = categories.flatMap(category => 
      userTagsByCategory[category] || []
    ).filter(userTag => userTag.tag);

    return (
      <div className="flex flex-wrap gap-2">
        {allTags.map((userTag) => (
          <Pill 
            key={userTag.id} 
            variant="secondary"
            size="sm"
          >
            {userTag.tag?.name}
          </Pill>
        ))}
      </div>
    );
  }

  // Full view - show tags grouped by category
  return (
    <div className="space-y-6">
      {categories.map((category) => {
        const categoryTags = userTagsByCategory[category];
        if (!categoryTags || categoryTags.length === 0) return null;

        return (
          <Card key={category}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base uppercase tracking-wide">
                {TAG_CATEGORY_LABELS[category]}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {categoryTags.map((userTag) => (
                  <Pill 
                    key={userTag.id} 
                    variant={category === 'core_discipline' ? 'primary' : 'secondary'}
                  >
                    {userTag.tag?.name}
                  </Pill>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
