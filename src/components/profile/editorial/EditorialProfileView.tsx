
import { AuthUser } from '@/types/auth';
import { CaseStudy } from '@/hooks/useCaseStudies';
import { EditorialHeroSection } from './EditorialHeroSection';
import { AboutSection } from './AboutSection';
import { ProfileDNASection } from './ProfileDNASection';
import { AwardsSection } from './AwardsSection';
import { ProjectShowcaseSection } from './ProjectShowcaseSection';
import { WorkPreferencesSection } from './WorkPreferencesSection';
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
      <EditorialHeroSection user={user} inviter={inviter} />

      {/* About Section */}
      <AboutSection user={user} />

      {/* Awards Section */}
      <AwardsSection user={user} />

      {/* Profile DNA Section - 3 columns */}
      <ProfileDNASection user={user} />

      {/* Project Showcase Section */}
      <ProjectShowcaseSection user={user} />

      {/* Work Preferences Section - 2 columns */}
      <WorkPreferencesSection user={user} />

      {/* Case Studies Section */}
      <HighlightedProjectsSection caseStudies={caseStudies} />

      {/* Collaboration Details Section */}
      <CollaborationDetailsSection user={user} />

      {/* Call to Action Section */}
      <CallToActionSection user={user} />
    </div>
  );
}
