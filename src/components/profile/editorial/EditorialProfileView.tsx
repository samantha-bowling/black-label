
import { AuthUser } from '@/types/auth';
import { CaseStudy } from '@/hooks/useCaseStudies';
import { EditorialHeroSection } from './EditorialHeroSection';
import { AboutSection } from './AboutSection';
import { ProfileDNASection } from './ProfileDNASection';
import { HighlightedProjectsSection } from './HighlightedProjectsSection';
import { CollaborationDetailsSection } from './CollaborationDetailsSection';
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

      {/* About Section */}
      <AboutSection user={user} />

      {/* Profile DNA Section */}
      <ProfileDNASection user={user} />

      {/* Highlighted Projects Section */}
      <HighlightedProjectsSection caseStudies={caseStudies} />

      {/* Collaboration Details Section */}
      <CollaborationDetailsSection user={user} />

      {/* Call to Action Section */}
      <CallToActionSection user={user} />
    </div>
  );
}
