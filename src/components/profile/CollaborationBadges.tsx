
import { useCollaborationOptions, COLLABORATION_TYPES } from '@/hooks/useCollaborationOptions';
import { Pill } from '@/components/ui/pill';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SectionHeader } from '@/components/ui/section-header';

interface CollaborationBadgesProps {
  userId?: string;
  isOwner?: boolean;
}

export function CollaborationBadges({ userId, isOwner = false }: CollaborationBadgesProps) {
  const { collaborationOptions, toggleCollaborationOption, isToggling } = useCollaborationOptions(userId);

  if (isOwner) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg uppercase tracking-wide">
            COLLABORATION OPTIONS
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Select the types of collaboration you're open to:
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {Object.entries(COLLABORATION_TYPES).map(([key, label]) => {
              const isSelected = collaborationOptions.some(opt => opt.option_type === key);
              
              return (
                <div key={key} className="flex items-center space-x-2">
                  <Checkbox
                    id={key}
                    checked={isSelected}
                    onCheckedChange={(checked) => 
                      toggleCollaborationOption({ 
                        optionType: key, 
                        isActive: !!checked 
                      })
                    }
                    disabled={isToggling}
                  />
                  <label
                    htmlFor={key}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {label}
                  </label>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Public view
  if (collaborationOptions.length === 0) {
    return null;
  }

  return (
    <div>
      <SectionHeader 
        title="AVAILABLE FOR" 
        level={3}
        className="mb-4"
      />
      <div className="flex flex-wrap gap-2">
        {collaborationOptions.map((option) => (
          <Pill 
            key={option.id} 
            variant="success"
          >
            {COLLABORATION_TYPES[option.option_type as keyof typeof COLLABORATION_TYPES] || option.option_type}
          </Pill>
        ))}
      </div>
    </div>
  );
}
