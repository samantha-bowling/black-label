
import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Circle } from 'lucide-react';

export function ProfileCompletionModal() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  // Calculate profile completion
  const calculateCompletion = () => {
    if (!user) return 0;
    
    let completed = 0;
    const total = 8;
    
    if (user.displayName) completed++;
    if (user.bio) completed++;
    if (user.skills?.length) completed++;
    if (user.core_disciplines?.length) completed++;
    if (user.location) completed++;
    if (user.years_experience) completed++;
    if (user.available_for?.length) completed++;
    if (user.rate_range_min && user.rate_range_max) completed++;
    
    return Math.round((completed / total) * 100);
  };

  const completionPercentage = calculateCompletion();

  useEffect(() => {
    if (user && user.onboarding_completed && completionPercentage < 60) {
      const hasSeenModal = localStorage.getItem('profile-completion-modal-seen');
      if (!hasSeenModal) {
        setShowModal(true);
      }
    }
  }, [user, completionPercentage]);

  const handleDismiss = () => {
    localStorage.setItem('profile-completion-modal-seen', 'true');
    setShowModal(false);
  };

  const sections = [
    { name: 'Basic Information', completed: !!(user?.displayName && user?.bio) },
    { name: 'Skills & Expertise', completed: !!(user?.skills?.length && user?.core_disciplines?.length) },
    { name: 'Work Preferences', completed: !!(user?.available_for?.length) },
    { name: 'Rate Information', completed: !!(user?.rate_range_min && user?.rate_range_max) },
  ];

  if (!showModal || !user) return null;

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center">
            Complete Your Profile
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-white mb-2">
              {completionPercentage}%
            </div>
            <Progress value={completionPercentage} className="h-2" />
            <p className="text-gray-400 text-sm mt-2">
              A complete profile gets 3x more visibility
            </p>
          </div>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="space-y-3">
                {sections.map((section) => (
                  <div key={section.name} className="flex items-center gap-3">
                    {section.completed ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-500" />
                    )}
                    <span className={section.completed ? 'text-white' : 'text-gray-400'}>
                      {section.name}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleDismiss}
              className="flex-1"
            >
              Later
            </Button>
            <Button
              onClick={() => {
                setShowModal(false);
                // Focus on profile tab
                const profileTab = document.querySelector('[data-tab="profile"]') as HTMLElement;
                if (profileTab) profileTab.click();
              }}
              className="flex-1"
            >
              Complete Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
