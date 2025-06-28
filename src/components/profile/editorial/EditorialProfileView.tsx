
import { AuthUser } from '@/types/auth';
import { CaseStudy } from '@/hooks/useCaseStudies';
import { EditorialHeroSection } from './EditorialHeroSection';
import { PersonalBackgroundSection } from './PersonalBackgroundSection';
import { CollaborationDetailsSection } from './CollaborationDetailsSection';
import { ProfessionalNarrativeSection } from './ProfessionalNarrativeSection';
import { SelectedCreditsSection } from './SelectedCreditsSection';
import { SocialProofSection } from './SocialProofSection';
import { CallToActionSection } from './CallToActionSection';

interface InviterInfo {
  id: string;
  displayName: string;
  avatarUrl?: string;
  smartUrlSlug?: string;
  publicProfile: boolean;
}

interface EditorialProfileViewProps {
  user: AuthUser;
  caseStudies: CaseStudy[];
  inviter?: InviterInfo | null;
}

export function EditorialProfileView({ user, caseStudies, inviter }: EditorialProfileViewProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <EditorialHeroSection user={user} />

      {/* Main Content - Single Column Layout */}
      <div className="relative">
        {/* Personal Background */}
        <PersonalBackgroundSection user={user} />

        {/* Collaboration Details */}
        <CollaborationDetailsSection user={user} />

        {/* Professional Narrative */}
        <ProfessionalNarrativeSection user={user} />

        {/* Selected Credits */}
        <SelectedCreditsSection 
          caseStudies={caseStudies} 
          pastCredits={user.past_credits} 
        />

        {/* Social Proof */}
        <SocialProofSection inviter={inviter} />

        {/* Call to Action */}
        <CallToActionSection user={user} />
      </div>
    </div>
  );
}
