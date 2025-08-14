import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Edit } from 'lucide-react';

interface ProfileSectionProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  children: ReactNode;
  editable?: boolean;
  onAdd?: () => void;
  onEdit?: () => void;
  isEmpty?: boolean;
  addButtonText?: string;
  className?: string;
}

export function ProfileSection({
  title,
  subtitle,
  icon,
  children,
  editable = false,
  onAdd,
  onEdit,
  isEmpty = false,
  addButtonText = "Add",
  className = ""
}: ProfileSectionProps) {
  return (
    <Card className={`bg-surface/50 border-border ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center gap-3">
          {icon && <div className="text-primary">{icon}</div>}
          <div>
            <CardTitle className="text-xl font-semibold text-white">{title}</CardTitle>
            {subtitle && (
              <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
        </div>
        
        {editable && (
          <div className="flex gap-2">
            {onAdd && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={onAdd}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                {addButtonText}
              </Button>
            )}
            {onEdit && !isEmpty && (
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onEdit}
                className="text-white/60 hover:text-white hover:bg-white/10"
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pt-0">
        {isEmpty ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              No {title.toLowerCase()} added yet
            </p>
            {editable && onAdd && (
              <Button 
                variant="outline" 
                onClick={onAdd}
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add your first {title.toLowerCase().slice(0, -1)}
              </Button>
            )}
          </div>
        ) : (
          children
        )}
      </CardContent>
    </Card>
  );
}