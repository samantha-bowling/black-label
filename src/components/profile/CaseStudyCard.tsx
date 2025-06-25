
import { useState } from 'react';
import { ExternalLink, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { CaseStudy } from '@/hooks/useCaseStudies';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CaseStudyCardProps {
  caseStudy: CaseStudy;
  isOwner?: boolean;
  onEdit?: (caseStudy: CaseStudy) => void;
  onDelete?: (id: string) => void;
  onToggleVisibility?: (id: string, isVisible: boolean) => void;
}

export function CaseStudyCard({ 
  caseStudy, 
  isOwner = false, 
  onEdit, 
  onDelete, 
  onToggleVisibility 
}: CaseStudyCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      {/* Media */}
      {caseStudy.media_url && !imageError && (
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <img
            src={caseStudy.media_url}
            alt={caseStudy.project_name}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
          {!caseStudy.is_visible && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary" className="bg-yellow-500 text-black">
                Hidden
              </Badge>
            </div>
          )}
        </div>
      )}

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-lg leading-tight mb-1">
              {caseStudy.project_name}
            </h3>
            {caseStudy.studio_name && (
              <p className="text-sm text-muted-foreground mb-1">
                at {caseStudy.studio_name}
              </p>
            )}
            {caseStudy.role_played && (
              <Badge variant="outline" className="text-xs">
                {caseStudy.role_played}
              </Badge>
            )}
          </div>

          {/* Owner Controls */}
          {isOwner && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onToggleVisibility?.(caseStudy.id, !caseStudy.is_visible)}
                className="h-8 w-8 p-0"
              >
                {caseStudy.is_visible ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onEdit?.(caseStudy)}
                className="h-8 w-8 p-0"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete?.(caseStudy.id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Timeline */}
        {caseStudy.timeline && (
          <p className="text-sm text-muted-foreground mb-3">
            📅 {caseStudy.timeline}
          </p>
        )}

        {/* Contributions */}
        {caseStudy.contributions && caseStudy.contributions.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-medium mb-2">Key Contributions:</h4>
            <ul className="space-y-1">
              {caseStudy.contributions.slice(0, 3).map((contribution, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start">
                  <span className="mr-2 mt-1.5 w-1 h-1 bg-primary rounded-full flex-shrink-0" />
                  {contribution}
                </li>
              ))}
              {caseStudy.contributions.length > 3 && (
                <li className="text-xs text-muted-foreground">
                  +{caseStudy.contributions.length - 3} more...
                </li>
              )}
            </ul>
          </div>
        )}

        {/* External Link */}
        {caseStudy.external_link && (
          <a
            href={caseStudy.external_link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm text-primary hover:text-primary/80 transition-colors"
          >
            View Project <ExternalLink className="w-3 h-3 ml-1" />
          </a>
        )}
      </CardContent>
    </Card>
  );
}
