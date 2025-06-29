
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Circle, ArrowRight } from 'lucide-react';

interface ProfileSection {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
}

export function ProfileCompletionModal() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [sections, setSections] = useState<ProfileSection[]>([]);

  useEffect(() => {
    if (!user) return;

    // Check if user just completed onboarding but profile is incomplete
    const shouldShow = user.onboarding_completed && !localStorage.getItem('profile-completion-dismissed');
    
    if (shouldShow) {
      const profileSections = calculateProfileSections(user);
      setSections(profileSections);
      
      // Only show if there are incomplete sections
      const incompleteRequired = profileSections.filter(s => s.required && !s.completed);
      if (incompleteRequired.length > 0) {
        setIsOpen(true);
      }
    }
  }, [user]);

  const calculateProfileSections = (user: any): ProfileSection[] => {
    return [
      {
        id: 'basic',
        title: 'Basic Information',
        description: 'Display name, bio, location',
        completed: !!(user.displayName && user.bio && user.location),
        required: true
      },
      {
        id: 'experience',
        title: 'Professional Experience',
        description: 'Years of experience, core disciplines',
        completed: !!(user.years_experience && user.core_disciplines?.length > 0),
        required: true
      },
      {
        id: 'skills',
        title: 'Skills & Expertise',
        description: 'Technical skills and specializations',
        completed: !!(user.skills?.length > 0),
        required: true
      },
      {
        id: 'work-preferences',
        title: 'Work Preferences',
        description: 'Available for, work style, rates',
        completed: !!(user.available_for?.length > 0 && user.work_style?.length > 0 && user.rate_type),
        required: false
      },
      {
        id: 'portfolio',
        title: 'Portfolio & Projects',
        description: 'Project showcase and case studies',
        completed: !!(user.project_showcase?.length > 0),
        required: false
      },
      {
        id: 'social',
        title: 'Social Links',
        description: 'Professional social media profiles',
        completed: !!(user.social_links && Object.keys(user.social_links).length > 0),
        required: false
      }
    ];
  };

  const completedCount = sections.filter(s => s.completed).length;
  const totalCount = sections.length;
  const requiredCount = sections.filter(s => s.required).length;
  const completedRequired = sections.filter(s => s.required && s.completed).length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  const handleDismiss = () => {
    localStorage.setItem('profile-completion-dismissed', 'true');
    setIsOpen(false);
  };

  const handleGoToProfile = () => {
    setIsOpen(false);
    // Navigate to profile tab in dashboard
    window.location.hash = '#profile';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-2xl bg-white/5 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Complete Your Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Progress Overview */}
          <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-white font-medium">Profile Completion</h3>
                  <p className="text-white/60 text-sm">
                    {completedRequired}/{requiredCount} required sections completed
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">{progressPercentage}%</div>
                  <div className="text-white/60 text-sm">Overall</div>
                </div>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </CardContent>
          </Card>

          {/* Sections List */}
          <div className="space-y-3">
            {sections.map((section) => (
              <div
                key={section.id}
                className={`flex items-center space-x-3 p-3 rounded-lg border ${
                  section.completed 
                    ? 'bg-green-500/10 border-green-500/20' 
                    : section.required 
                    ? 'bg-amber-500/10 border-amber-500/20'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {section.completed ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <Circle className="w-5 h-5 text-white/40" />
                )}
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="text-white font-medium">{section.title}</h4>
                    {section.required && !section.completed && (
                      <span className="text-xs bg-amber-500 text-black px-2 py-0.5 rounded-full">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-white/60 text-sm">{section.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleDismiss}
              className="bg-white/10 hover:bg-white/20 border-white/20"
            >
              Remind me later
            </Button>
            <Button
              onClick={handleGoToProfile}
              className="bg-white text-black hover:bg-gray-200"
            >
              Complete Profile
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
