
import { useCollaborationOptions, COLLABORATION_TYPES } from '@/hooks/useCollaborationOptions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
          <CardTitle className="text-lg">Collaboration Options</CardTitle>
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
      <h3 className="text-lg font-semibold mb-3">Available For</h3>
      <div className="flex flex-wrap gap-2">
        {collaborationOptions.map((option) => (
          <Badge 
            key={option.id} 
            variant="secondary"
            className="bg-green-100 text-green-800 hover:bg-green-200"
          >
            {COLLABORATION_TYPES[option.option_type as keyof typeof COLLABORATION_TYPES] || option.option_type}
          </Badge>
        ))}
      </div>
    </div>
  );
}
