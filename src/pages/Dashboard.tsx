
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { RoleSelectionStep } from '@/components/onboarding/RoleSelectionStep';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { HeadingXL, CardLuxe } from '@/components/ui/primitives';
import { UserRole } from '@/types/auth';

export default function Dashboard() {
  const { user } = useAuth();
  const { needsRoleSelection, needsOnboarding, userRole } = useUserRole();

  // Show role selection if user doesn't have a role
  if (needsRoleSelection()) {
    return (
      <RoleSelectionStep 
        onComplete={(role: UserRole) => {
          // Role updated, component will re-render
          window.location.reload();
        }} 
      />
    );
  }

  // Show onboarding if user hasn't completed it
  if (needsOnboarding()) {
    return (
      <OnboardingFlow 
        userRole={userRole!}
        onComplete={() => {
          // Onboarding completed, component will re-render  
          window.location.reload();
        }}
      />
    );
  }

  // Main dashboard for completed users
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <HeadingXL className="text-white" gradient>
            Welcome back, {user?.displayName}!
          </HeadingXL>
          <p className="text-white/80 text-xl">
            {userRole === 'gig_seeker' ? 
              "Ready to find your next gaming gig?" : 
              "Ready to find the perfect talent for your project?"
            }
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CardLuxe className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              {userRole === 'gig_seeker' ? 'Browse Gigs' : 'Post a Gig'}
            </h3>
            <p className="text-white/70 mb-4">
              {userRole === 'gig_seeker' ? 
                'Discover exciting opportunities in the gaming industry' :
                'Find the perfect talent for your next project'
              }
            </p>
            <div className="bg-white/10 text-white/60 px-4 py-2 rounded text-sm">
              Coming in Phase 3
            </div>
          </CardLuxe>

          <CardLuxe className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Profile
            </h3>
            <p className="text-white/70 mb-4">
              Manage your profile and settings
            </p>
            <div className="bg-white/10 text-white/60 px-4 py-2 rounded text-sm">
              Coming Soon
            </div>
          </CardLuxe>

          <CardLuxe className="p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              {userRole === 'gig_seeker' ? 'Applications' : 'My Gigs'}
            </h3>
            <p className="text-white/70 mb-4">
              {userRole === 'gig_seeker' ? 
                'Track your gig applications' :
                'Manage your posted gigs'
              }
            </p>
            <div className="bg-white/10 text-white/60 px-4 py-2 rounded text-sm">
              Coming in Phase 3
            </div>
          </CardLuxe>
        </div>
      </div>
    </div>
  );
}
