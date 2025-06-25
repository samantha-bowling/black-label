
import { useState } from 'react';
import { UserRole } from '@/types/auth';
import { useSession } from '@/hooks/useSession';
import { useToast } from '@/hooks/use-toast';
import { ButtonPrimary } from '@/components/ui/primitives';
import { CardLuxe, HeadingLG } from '@/components/ui/primitives';
import { Users, Briefcase } from 'lucide-react';

interface RoleSelectionStepProps {
  onComplete: (role: UserRole) => void;
}

export function RoleSelectionStep({ onComplete }: RoleSelectionStepProps) {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user, upsertUserProgress, refreshUser } = useSession();
  const { toast } = useToast();

  const handleRoleSelection = async () => {
    if (!selectedRole || !user) return;

    setIsLoading(true);
    try {
      const { error } = await upsertUserProgress({ role: selectedRole });

      if (error) throw new Error(error);

      // Refresh user data to get updated role
      await refreshUser();

      toast({
        title: "Role Selected",
        description: `You're now set up as a ${selectedRole === 'gig_seeker' ? 'Gig Seeker' : 'Gig Poster'}!`,
      });

      onComplete(selectedRole);
    } catch (error) {
      console.error('Error updating role:', error);
      toast({
        title: "Error",
        description: "Failed to save your role selection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <HeadingLG className="text-white">
            Welcome to BlackLabel.gg
          </HeadingLG>
          <p className="text-white/80 text-lg">
            Let's get you set up. What brings you here?
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <CardLuxe
            className={`p-6 cursor-pointer transition-all duration-200 ${
              selectedRole === 'gig_seeker' 
                ? 'ring-2 ring-white/50 bg-white/10' 
                : 'hover:bg-white/5'
            }`}
            onClick={() => setSelectedRole('gig_seeker')}
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  I'm here to find work
                </h3>
                <p className="text-white/70">
                  Browse and apply to exciting gaming gigs. Show off your skills and build your portfolio.
                </p>
              </div>
            </div>
          </CardLuxe>

          <CardLuxe
            className={`p-6 cursor-pointer transition-all duration-200 ${
              selectedRole === 'gig_poster' 
                ? 'ring-2 ring-white/50 bg-white/10' 
                : 'hover:bg-white/5'
            }`}
            onClick={() => setSelectedRole('gig_poster')}
          >
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-white/10 rounded-full flex items-center justify-center">
                <Briefcase className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  I'm here to hire talent
                </h3>
                <p className="text-white/70">
                  Post gigs and find the perfect talent for your gaming projects. Build your dream team.
                </p>
              </div>
            </div>
          </CardLuxe>
        </div>

        <div className="text-center">
          <ButtonPrimary
            onClick={handleRoleSelection}
            disabled={!selectedRole}
            isLoading={isLoading}
            size="lg"
            className="px-12"
          >
            Continue
          </ButtonPrimary>
          {!selectedRole && (
            <p className="text-white/60 text-sm mt-2">
              Please select an option to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
