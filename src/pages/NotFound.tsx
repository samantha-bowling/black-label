
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, Search } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  const isProfileSlugAttempt = location.pathname.length > 1 && 
    !location.pathname.includes('/') && 
    location.pathname.match(/^\/[a-z0-9-]+$/);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-6">
      <Card className="max-w-md bg-white/5 border-white/10">
        <CardHeader className="text-center">
          <AlertCircle className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <CardTitle className="text-2xl text-white">
            {isProfileSlugAttempt ? 'Profile Not Found' : 'Page Not Found'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-white/70">
            {isProfileSlugAttempt 
              ? "The profile you're looking for doesn't exist or isn't publicly available."
              : "The page you're looking for doesn't exist."
            }
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <Button asChild variant="default" className="flex-1">
              <Link to="/">
                <Home className="w-4 h-4 mr-2" />
                Return Home
              </Link>
            </Button>
            
            {isProfileSlugAttempt && (
              <Button asChild variant="outline" className="flex-1">
                <Link to="/">
                  <Search className="w-4 h-4 mr-2" />
                  Browse Profiles
                </Link>
              </Button>
            )}
          </div>
          
          {isProfileSlugAttempt && (
            <p className="text-xs text-white/50 mt-4">
              Profile URLs are case-sensitive and can only contain lowercase letters, numbers, and hyphens.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
