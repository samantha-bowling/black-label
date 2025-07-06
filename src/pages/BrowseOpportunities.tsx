import { useRoleAccess } from "@/hooks/useRoleAccess";
import { GigBrowser } from "@/components/gig/GigBrowser";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const BrowseOpportunities = () => {
  const { canApplyToGigs } = useRoleAccess();
  const navigate = useNavigate();

  useEffect(() => {
    // Only gig seekers can browse and apply to gigs
    if (!canApplyToGigs) {
      navigate('/dashboard');
      return;
    }
  }, [canApplyToGigs, navigate]);

  if (!canApplyToGigs) {
    return null;
  }

  return <GigBrowser />;
};

export default BrowseOpportunities;