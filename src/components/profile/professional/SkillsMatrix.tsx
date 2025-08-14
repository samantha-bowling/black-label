import { Badge } from '@/components/ui/badge';
import { Star, Award } from 'lucide-react';
import { TechnicalSkill, SKILL_CATEGORIES } from '@/hooks/useTechnicalSkills';

interface SkillsMatrixProps {
  skills: TechnicalSkill[];
  editable?: boolean;
  onEdit?: (skill: TechnicalSkill) => void;
}

export function SkillsMatrix({ skills, editable, onEdit }: SkillsMatrixProps) {
  const getProficiencyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'expert':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'advanced':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'intermediate':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'beginner':
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
      default:
        return 'bg-white/10 text-white border-white/20';
    }
  };

  const getProficiencyStars = (level: string) => {
    switch (level.toLowerCase()) {
      case 'expert': return 4;
      case 'advanced': return 3;
      case 'intermediate': return 2;
      case 'beginner': return 1;
      default: return 1;
    }
  };

  const groupedSkills = SKILL_CATEGORIES.reduce((acc, category) => {
    acc[category] = skills.filter(skill => skill.skill_category === category);
    return acc;
  }, {} as Record<string, TechnicalSkill[]>);

  // Add skills from categories not in our predefined list
  const otherSkills = skills.filter(skill => !SKILL_CATEGORIES.includes(skill.skill_category as any));
  if (otherSkills.length > 0) {
    groupedSkills['Other'] = otherSkills;
  }

  if (skills.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {Object.entries(groupedSkills).map(([category, categorySkills]) => {
        if (categorySkills.length === 0) return null;

        return (
          <div key={category}>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" />
              {category}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categorySkills.map((skill) => (
                <div
                  key={skill.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    editable 
                      ? 'cursor-pointer hover:bg-white/5 border-white/10 hover:border-white/20' 
                      : 'border-white/10'
                  }`}
                  onClick={() => editable && onEdit?.(skill)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-white flex items-center gap-2">
                        {skill.skill_name}
                        {skill.is_primary_skill && (
                          <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        )}
                      </h4>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getProficiencyColor(skill.proficiency_level)}>
                          {skill.proficiency_level}
                        </Badge>
                        
                        <div className="flex gap-0.5">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < getProficiencyStars(skill.proficiency_level)
                                  ? 'text-primary fill-current'
                                  : 'text-gray-600'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    {skill.years_experience && (
                      <span>{skill.years_experience} years</span>
                    )}
                    {skill.endorsement_count > 0 && (
                      <span>{skill.endorsement_count} endorsements</span>
                    )}
                  </div>
                  
                  {skill.last_used_date && (
                    <div className="text-xs text-muted-foreground mt-1">
                      Last used: {new Date(skill.last_used_date).getFullYear()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}