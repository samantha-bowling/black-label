
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { RoleSelectionStep } from '@/components/onboarding/RoleSelectionStep';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';

export default function Dashboard() {
  const { user } = useAuth();
  const { needsRoleSelection, needsOnboarding, userRole } = useUserRole();

  if (!user) {
    return null; // AuthGuard should handle this
  }

  // Show role selection if user has no role
  if (needsRoleSelection) {
    return (
      <RoleSelectionStep
        onComplete={(selectedRole) => {
          // The role selection component will handle the database update
          // and the auth context will be updated automatically
          window.location.reload(); // Simple refresh to update the UI
        }}
      />
    );
  }

  // Show onboarding if user has role but hasn't completed onboarding
  if (needsOnboarding && userRole) {
    return (
      <OnboardingFlow
        userRole={userRole}
        onComplete={() => {
          window.location.reload(); // Simple refresh to update the UI
        }}
      />
    );
  }

  // Main dashboard content
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Welcome to BlackLabel.gg
          </h1>
          <p className="text-white/80 text-lg mb-8">
            Your gaming talent marketplace
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 max-w-md mx-auto">
            <h2 className="text-xl font-semibold text-white mb-2">
              Hello, {user.displayName}!
            </h2>
            <p className="text-white/70 mb-4">
              Role: {userRole || 'Not set'}
            </p>
            <p className="text-white/60 text-sm">
              Dashboard features coming soon...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
