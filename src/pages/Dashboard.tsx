import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { InviteManager } from "@/components/invites/InviteManager";
import { ProfileSettings } from "@/components/profile/ProfileSettings";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isGigPoster = user.role === 'gig_poster';
  const isAdmin = user.role === 'admin';
  const showInvites = !isGigPoster; // Hide invites for gig posters

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {user.displayName}!
          </h1>
          <div className="flex items-center gap-2">
            <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>
              {user.role?.replace('_', ' ').toUpperCase()}
            </Badge>
            {!user.onboarding_completed && (
              <Badge variant="outline">Setup Incomplete</Badge>
            )}
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white/10">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            {showInvites && (
              <TabsTrigger value="invites">
                Invites {user.invites_remaining > 0 && `(${user.invites_remaining})`}
              </TabsTrigger>
            )}
            {isAdmin && <TabsTrigger value="admin">Admin</TabsTrigger>}
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Profile Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-white/70">Onboarding</span>
                      <Badge variant={user.onboarding_completed ? "secondary" : "destructive"}>
                        {user.onboarding_completed ? "Complete" : "Incomplete"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/70">Public Profile</span>
                      <Badge variant={user.public_profile ? "secondary" : "outline"}>
                        {user.public_profile ? "Visible" : "Hidden"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {isGigPoster && (
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      onClick={() => navigate('/post-a-gig')}
                      className="w-full"
                    >
                      Post a New Gig
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => navigate('/' + user.smart_url_slug)}
                      className="w-full"
                    >
                      View Public Profile
                    </Button>
                  </CardContent>
                </Card>
              )}

              {showInvites && (
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">Invitations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-white/70">Remaining</span>
                        <Badge variant="secondary">{user.invites_remaining}</Badge>
                      </div>
                      {user.invited_by_user_id && (
                        <div className="text-sm text-white/60">
                          You were invited to join
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {!user.onboarding_completed && (
              <Card className="bg-amber-500/10 border-amber-500/20">
                <CardHeader>
                  <CardTitle className="text-amber-400">Complete Your Setup</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-white/80 mb-4">
                    Finish setting up your profile to get the most out of the platform.
                  </p>
                  <Button 
                    variant="secondary"
                    onClick={() => navigate('/onboarding')}
                  >
                    Complete Onboarding
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="profile">
            <ProfileSettings />
          </TabsContent>

          {showInvites && (
            <TabsContent value="invites">
              <InviteManager />
            </TabsContent>
          )}

          {isAdmin && (
            <TabsContent value="admin">
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Admin Panel</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => navigate('/admin')}>
                    Open Admin Dashboard
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
