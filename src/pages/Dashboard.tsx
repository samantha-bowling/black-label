
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { RoleSelectionStep } from '@/components/onboarding/RoleSelectionStep';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { InviteManager } from '@/components/invites/InviteManager';
import { HeadingLG, ButtonSecondary, CardLuxe } from '@/components/ui/primitives';
import { Users, Settings } from 'lucide-react';
import { useState } from 'react';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { needsRoleSelection, needsOnboarding, userRole } = useUserRole();
  const [activeTab, setActiveTab] = useState<'overview' | 'invites'>('overview');

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
      {/* Header */}
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="/lovable-uploads/5c266225-a588-440b-b158-3bb0d529a94f.png" 
                alt="BlackLabel.gg" 
                className="h-8"
              />
              <nav className="flex space-x-6">
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`text-sm font-medium transition-colors ${
                    activeTab === 'overview' 
                      ? 'text-white' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setActiveTab('invites')}
                  className={`text-sm font-medium transition-colors ${
                    activeTab === 'invites' 
                      ? 'text-white' 
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  <Users className="w-4 h-4 inline mr-1" />
                  Invites
                </button>
              </nav>
            </div>
            <ButtonSecondary onClick={signOut} size="sm">
              <Settings className="w-4 h-4 mr-1" />
              Sign Out
            </ButtonSecondary>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {activeTab === 'overview' ? (
          <div className="space-y-8">
            <div className="text-center">
              <HeadingLG className="text-white mb-4">
                Welcome to BlackLabel.gg
              </HeadingLG>
              <p className="text-white/80 text-lg mb-8">
                Your gaming talent marketplace
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <CardLuxe className="p-6">
                <h2 className="text-xl font-semibold text-white mb-2">
                  Hello, {user.displayName}!
                </h2>
                <p className="text-white/70 mb-4">
                  Role: {userRole || 'Not set'}
                </p>
                <div className="space-y-2 text-sm text-white/60">
                  <p>✓ Profile setup complete</p>
                  <p>✓ Email verified</p>
                  <p>• Dashboard features coming soon...</p>
                </div>
              </CardLuxe>

              <CardLuxe className="p-6">
                <h3 className="text-lg font-semibold text-white mb-2">
                  Community Status
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-white/70">
                    Invites remaining: {user.invites_remaining}
                  </p>
                  {user.invited_by_user_id && (
                    <p className="text-white/60">
                      Invited by community member
                    </p>
                  )}
                  {user.role === 'admin' && (
                    <p className="text-primary font-medium">
                      Admin privileges active
                    </p>
                  )}
                </div>
              </CardLuxe>
            </div>
          </div>
        ) : (
          <InviteManager />
        )}
      </div>
    </div>
  );
}
