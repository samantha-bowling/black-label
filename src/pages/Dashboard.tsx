
import { useAuth } from '@/hooks/useAuth';
import { useUserRole } from '@/hooks/useUserRole';
import { useFeatureFlags } from '@/hooks/useFeatureFlags';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const { userRole, canPostGigs, canApplyToGigs } = useUserRole();
  const { flags, isEnabled } = useFeatureFlags();

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'gig_poster':
        return 'Studio/Company';
      case 'gig_seeker':
        return 'Freelancer';
      case 'admin':
        return 'Administrator';
      default:
        return role;
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'gig_poster':
        return 'default';
      case 'gig_seeker':
        return 'secondary';
      case 'admin':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">BlackLabel.gg Dashboard</h1>
            <p className="text-slate-300">Welcome back, {user?.displayName || user?.email}</p>
          </div>
          <Button
            onClick={signOut}
            variant="outline"
            className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700"
          >
            Sign Out
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                Your Profile
                <Badge variant={getRoleBadgeVariant(userRole || '')}>
                  {getRoleDisplay(userRole || '')}
                </Badge>
              </CardTitle>
              <CardDescription className="text-slate-300">
                Account information and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="text-white">
              <div className="space-y-2">
                <p><span className="text-slate-400">Email:</span> {user?.email}</p>
                <p><span className="text-slate-400">Role:</span> {getRoleDisplay(userRole || '')}</p>
                {user?.bio && (
                  <p><span className="text-slate-400">Bio:</span> {user.bio}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Permissions Card */}
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Your Permissions</CardTitle>
              <CardDescription className="text-slate-300">
                What you can do on the platform
              </CardDescription>
            </CardHeader>
            <CardContent className="text-white">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${canPostGigs() ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span>Post Gigs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${canApplyToGigs() ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span>Apply to Gigs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${userRole === 'admin' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span>Admin Access</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature Flags Card */}
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Platform Features</CardTitle>
              <CardDescription className="text-slate-300">
                Currently available features
              </CardDescription>
            </CardHeader>
            <CardContent className="text-white">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${flags.messaging ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span>Messaging</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${flags.reviews ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span>Reviews</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${flags.milestone_tracking ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span>Milestone Tracking</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${flags.application_filters ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span>Application Filters</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-4">Quick Actions</h2>
          <div className="flex gap-4">
            {canPostGigs() && (
              <Button className="bg-purple-600 hover:bg-purple-700">
                Post a New Gig
              </Button>
            )}
            {canApplyToGigs() && (
              <Button variant="outline" className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700">
                Browse Available Gigs
              </Button>
            )}
            {isEnabled('messaging') && (
              <Button variant="outline" className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700">
                Messages
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
