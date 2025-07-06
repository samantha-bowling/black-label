
import { useAuth } from "@/hooks/useAuth";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { PosterOnboardingFlow } from "@/components/onboarding/PosterOnboardingFlow";
import { GigPostingForm } from "@/components/gig/GigPostingForm";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const PostGig = () => {
  const { user } = useAuth();
  const { canPostGigs, canApplyToGigs, needsOnboarding } = useRoleAccess();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Give time for user profile to be created after signup
    const checkUserStatus = () => {
      if (!user) {
        // Redirect non-authenticated users to auth with poster role context
        navigate('/auth?role=poster');
        return;
      }

      // If user exists but doesn't have gig posting capability, redirect
      if (user.role && !canPostGigs) {
        navigate('/dashboard');
        return;
      }

      // If user role is not set yet, wait a bit more
      if (!user.role) {
        setTimeout(checkUserStatus, 1000);
        return;
      }

      setIsLoading(false);
    };

    // Initial check with slight delay to allow for profile creation
    const timer = setTimeout(checkUserStatus, 500);
    
    return () => clearTimeout(timer);
  }, [user, canPostGigs, navigate]);

  // Show loading while determining user status
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/80">Setting up your account...</p>
        </div>
      </div>
    );
  }

  // Show onboarding if user needs it
  if (user && (!user.onboarding_completed || needsOnboarding)) {
    return (
      <PosterOnboardingFlow 
        onComplete={() => window.location.reload()} 
      />
    );
  }

  // Show gig posting form if user can post gigs
  if (user && canPostGigs) {
    return <GigPostingForm />;
  }

  return null;
};

export default PostGig;
