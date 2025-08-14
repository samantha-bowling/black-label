import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Circle, Target } from 'lucide-react';
import { AuthUser } from '@/types/auth';

interface ProfileCompletionIndicatorProps {
  user: AuthUser;
  className?: string;
}

export function ProfileCompletionIndicator({ user, className }: ProfileCompletionIndicatorProps) {
  const score = user.profile_completion_score || 0;
  
  const completionItems = [
    {
      label: 'Profile photo',
      completed: !!user.avatarUrl,
      points: 5
    },
    {
      label: 'Professional headline',
      completed: !!user.professional_headline,
      points: 5
    },
    {
      label: 'About section (50+ characters)',
      completed: !!(user.bio && user.bio.length > 50),
      points: 10
    },
    {
      label: 'Current position',
      completed: !!user.current_position,
      points: 5
    },
    {
      label: 'Location',
      completed: !!user.location,
      points: 5
    },
    {
      label: 'Years of experience',
      completed: !!user.years_experience,
      points: 5
    },
    {
      label: 'Core disciplines (1+)',
      completed: !!(user.core_disciplines && user.core_disciplines.length > 0),
      points: 10
    },
    {
      label: 'Work experience',
      completed: false, // This would need to be checked against the work_experience table
      points: 10
    },
    {
      label: 'Technical skills (1+)',
      completed: false, // This would need to be checked against the technical_skills table
      points: 5
    }
  ];

  const completedCount = completionItems.filter(item => item.completed).length;
  const totalItems = completionItems.length;

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-400';
    if (score >= 60) return 'text-blue-400';
    if (score >= 40) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-blue-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className={`bg-surface/50 border-border ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-white">Profile Strength</h3>
            <p className="text-sm text-muted-foreground">
              {completedCount}/{totalItems} sections completed
            </p>
          </div>
          <div className="ml-auto">
            <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
              {score}%
            </span>
          </div>
        </div>

        <Progress 
          value={score} 
          className="mb-4"
          style={{
            '--progress-background': getProgressColor(score)
          } as React.CSSProperties}
        />

        <div className="space-y-2">
          {completionItems.map((item, index) => (
            <div key={index} className="flex items-center gap-3 text-sm">
              {item.completed ? (
                <CheckCircle className="w-4 h-4 text-emerald-400" />
              ) : (
                <Circle className="w-4 h-4 text-muted-foreground" />
              )}
              <span className={item.completed ? 'text-white' : 'text-muted-foreground'}>
                {item.label}
              </span>
              <span className="ml-auto text-xs text-muted-foreground">
                +{item.points}pts
              </span>
            </div>
          ))}
        </div>

        {score < 100 && (
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-sm text-blue-400">
              💡 Complete your profile to increase visibility and attract better opportunities!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}