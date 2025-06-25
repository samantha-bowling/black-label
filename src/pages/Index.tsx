
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useSessionStatus } from '@/hooks/useSessionStatus';

export default function Index() {
  const { isAuthenticated, user } = useSessionStatus();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white">BlackLabel.gg</h1>
            <Badge variant="secondary" className="bg-purple-600 text-white">
              Beta
            </Badge>
          </div>
          <div className="flex gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-white mr-4">Welcome, {user?.displayName || user?.email}</span>
                <Button asChild className="bg-purple-600 hover:bg-purple-700">
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700">
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button asChild className="bg-purple-600 hover:bg-purple-700">
                  <Link to="/auth">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-6">
            Elite Gaming Talent Platform
          </h2>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Connect studios and creative teams with proven experts for freelance, 
            consulting, and scoped contract work in the video game industry.
          </p>
          {!isAuthenticated && (
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link to="/auth">Join BlackLabel.gg</Link>
            </Button>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">For Studios</CardTitle>
              <CardDescription className="text-slate-300">
                Post gigs and find elite talent
              </CardDescription>
            </CardHeader>
            <CardContent className="text-white">
              <ul className="space-y-2">
                <li>• Post detailed project requirements</li>
                <li>• Review qualified applications</li>
                <li>• Connect with proven professionals</li>
                <li>• Manage projects efficiently</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">For Freelancers</CardTitle>
              <CardDescription className="text-slate-300">
                Discover premium opportunities
              </CardDescription>
            </CardHeader>
            <CardContent className="text-white">
              <ul className="space-y-2">
                <li>• Browse curated gig listings</li>
                <li>• Submit compelling applications</li>
                <li>• Showcase your portfolio</li>
                <li>• Build professional relationships</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-white">Platform Features</CardTitle>
              <CardDescription className="text-slate-300">
                Built for the gaming industry
              </CardDescription>
            </CardHeader>
            <CardContent className="text-white">
              <ul className="space-y-2">
                <li>• Role-based access control</li>
                <li>• Secure file attachments</li>
                <li>• Application tracking</li>
                <li>• Feature flag system</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Level Up Your Game Development?
          </h3>
          <p className="text-lg text-slate-300 mb-8">
            Join the premier platform connecting gaming talent with opportunities.
          </p>
          {!isAuthenticated && (
            <div className="flex gap-4 justify-center">
              <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
                <Link to="/auth">Sign Up as Freelancer</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700">
                <Link to="/auth">Post a Gig</Link>
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 mt-16 border-t border-slate-700">
        <div className="text-center text-slate-400">
          <p>&copy; 2024 BlackLabel.gg - Elite Gaming Talent Platform</p>
        </div>
      </footer>
    </div>
  );
}
