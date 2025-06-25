
import { useAuth } from "@/hooks/useAuth";
import { useUserRole } from "@/hooks/useUserRole";
import { PosterOnboardingFlow } from "@/components/onboarding/PosterOnboardingFlow";
import { GigPostingForm } from "@/components/gig/GigPostingForm";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const PostGig = () => {
  const { user } = useAuth();
  const { canPostGigs, needsOnboarding } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect non-authenticated users to auth
    if (!user) {
      navigate('/auth');
      return;
    }

    // If user doesn't have gig_poster role, redirect to role selection
    if (user.role && !canPostGigs()) {
      navigate('/dashboard');
      return;
    }
  }, [user, canPostGigs, navigate]);

  // Show onboarding if user needs it
  if (user && (!user.onboarding_completed || needsOnboarding())) {
    return (
      <PosterOnboardingFlow 
        onComplete={() => window.location.reload()} 
      />
    );
  }

  // Show gig posting form if user is ready
  if (user && canPostGigs()) {
    return <GigPostingForm />;
  }

  return null;
};

export default PostGig;
