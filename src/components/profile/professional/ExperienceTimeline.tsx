import { formatDistanceToNow, format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { WorkExperience } from '@/hooks/useWorkExperience';

interface ExperienceTimelineProps {
  experiences: WorkExperience[];
  editable?: boolean;
  onEdit?: (experience: WorkExperience) => void;
}

export function ExperienceTimeline({ experiences, editable, onEdit }: ExperienceTimelineProps) {
  const formatDateRange = (startDate: string, endDate?: string, isCurrent?: boolean) => {
    const start = format(parseISO(startDate), 'MMM yyyy');
    
    if (isCurrent) {
      return `${start} - Present`;
    }
    
    if (endDate) {
      const end = format(parseISO(endDate), 'MMM yyyy');
      return `${start} - ${end}`;
    }
    
    return start;
  };

  const calculateDuration = (startDate: string, endDate?: string, isCurrent?: boolean) => {
    const start = parseISO(startDate);
    const end = isCurrent ? new Date() : (endDate ? parseISO(endDate) : new Date());
    
    return formatDistanceToNow(start, { addSuffix: false });
  };

  if (experiences.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {experiences.map((experience, index) => (
        <div 
          key={experience.id} 
          className="relative pl-8 group"
          onClick={() => editable && onEdit?.(experience)}
        >
          {/* Timeline line */}
          {index < experiences.length - 1 && (
            <div className="absolute left-3 top-8 w-0.5 h-full bg-border"></div>
          )}
          
          {/* Timeline dot */}
          <div className="absolute left-1.5 top-2 w-3 h-3 bg-primary rounded-full border-2 border-background"></div>
          
          <div className={`${editable ? 'cursor-pointer hover:bg-white/5 p-4 rounded-lg transition-colors' : ''}`}>
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
              <div>
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  {experience.position_title}
                </h3>
                <p className="text-primary font-medium">{experience.company_name}</p>
              </div>
              
              <div className="text-sm text-muted-foreground text-right">
                <div className="flex items-center gap-1 justify-end">
                  <Calendar className="w-3 h-3" />
                  {formatDateRange(experience.start_date, experience.end_date, experience.is_current)}
                </div>
                <div className="mt-1">
                  {calculateDuration(experience.start_date, experience.end_date, experience.is_current)}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              {experience.employment_type && (
                <Badge variant="secondary" className="bg-white/10 text-white">
                  {experience.employment_type}
                </Badge>
              )}
              {experience.location && (
                <Badge variant="outline" className="border-white/20 text-white">
                  <MapPin className="w-3 h-3 mr-1" />
                  {experience.location}
                </Badge>
              )}
            </div>

            {experience.description && (
              <p className="text-white/80 mb-3 leading-relaxed">
                {experience.description}
              </p>
            )}

            {experience.key_achievements && experience.key_achievements.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-medium text-white mb-2">Key Achievements:</h4>
                <ul className="space-y-1">
                  {experience.key_achievements.map((achievement, i) => (
                    <li key={i} className="text-sm text-white/70 flex items-start">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      {achievement}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {experience.technologies_used && experience.technologies_used.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {experience.technologies_used.map((tech, i) => (
                  <Badge key={i} variant="outline" className="text-xs border-white/20 text-white/60">
                    {tech}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}