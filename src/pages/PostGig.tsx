
import { useAuth } from "@/hooks/useAuth";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { PosterOnboardingFlow } from "@/components/onboarding/PosterOnboardingFlow";
import { GigPostingForm } from "@/components/gig/GigPostingForm";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const PostGig = () => {
  const { user } = useAuth();
  const { canPostGigs, needsOnboarding } = useRoleAccess();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect non-authenticated users to auth with poster role context
    if (!user) {
      navigate('/auth?role=poster');
      return;
    }

    // If user doesn't have gig posting capability, they shouldn't be here
    if (user.role && !canPostGigs) {
      navigate('/dashboard');
      return;
    }
  }, [user, canPostGigs, navigate]);

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
