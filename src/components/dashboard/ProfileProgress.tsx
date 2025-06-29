
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Info } from 'lucide-react';

export function ProfileProgress() {
  const { user } = useAuth();

  if (!user) return null;

  const calculateCompletionStats = () => {
    const sections = [
      {
        name: 'Basic Info',
        completed: !!(user.displayName && user.bio && user.location),
        required: true
      },
      {
        name: 'Experience',
        completed: !!(user.years_experience && user.core_disciplines?.length > 0),
        required: true
      },
      {
        name: 'Skills',
        completed: !!(user.skills?.length > 0),
        required: true
      },
      {
        name: 'Work Preferences',
        completed: !!(user.available_for?.length > 0 && user.work_style?.length > 0),
        required: false
      },
      {
        name: 'Portfolio',
        completed: !!(user.project_showcase?.length > 0),
        required: false
      },
      {
        name: 'Social Links',
        completed: !!(user.social_links && Object.keys(user.social_links).length > 0),
        required: false
      }
    ];

    const completed = sections.filter(s => s.completed).length;
    const total = sections.length;
    const requiredCompleted = sections.filter(s => s.required && s.completed).length;
    const requiredTotal = sections.filter(s => s.required).length;
    const missingRequired = sections.filter(s => s.required && !s.completed);

    return {
      overall: Math.round((completed / total) * 100),
      required: Math.round((requiredCompleted / requiredTotal) * 100),
      missingRequired,
      sections
    };
  };

  const stats = calculateCompletionStats();

  const getStatusIcon = () => {
    if (stats.required === 100) {
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    } else if (stats.required >= 50) {
      return <AlertTriangle className="w-5 h-5 text-amber-400" />;
    } else {
      return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getStatusMessage = () => {
    if (stats.required === 100) {
      return "Your profile looks great! Consider adding optional sections to stand out more.";
    } else if (stats.missingRequired.length > 0) {
      return `Complete ${stats.missingRequired.length} more required section${stats.missingRequired.length > 1 ? 's' : ''} to improve your visibility.`;
    }
    return "Keep building your profile to attract better opportunities.";
  };

  return (
    <Card className="bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-white">
          <span>Profile Completion</span>
          {getStatusIcon()}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-white/70 text-sm">Overall Progress</span>
            <span className="text-white font-medium">{stats.overall}%</span>
          </div>
          <Progress value={stats.overall} className="h-2" />
        </div>

        <div className="space-y-2">
          <p className="text-white/80 text-sm">{getStatusMessage()}</p>
          
          {stats.missingRequired.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {stats.missingRequired.map((section) => (
                <Badge key={section.name} variant="outline" className="text-xs">
                  {section.name}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2 pt-2">
          {stats.sections.map((section) => (
            <div
              key={section.name}
              className={`flex items-center space-x-2 text-xs p-2 rounded ${
                section.completed 
                  ? 'bg-green-500/10 text-green-300' 
                  : section.required 
                  ? 'bg-amber-500/10 text-amber-300'
                  : 'bg-white/5 text-white/60'
              }`}
            >
              {section.completed ? (
                <CheckCircle className="w-3 h-3" />
              ) : (
                <div className="w-3 h-3 border border-current rounded-full" />
              )}
              <span>{section.name}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
