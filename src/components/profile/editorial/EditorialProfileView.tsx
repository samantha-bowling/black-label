
import { AuthUser } from '@/types/auth';
import { CaseStudy } from '@/hooks/useCaseStudies';
import { EditorialHeroSection } from './EditorialHeroSection';
import { ProfileDNASection } from './ProfileDNASection';
import { SelectedCreditsSection } from './SelectedCreditsSection';
import { ProfessionalNarrativeSection } from './ProfessionalNarrativeSection';
import { GigPreferencesSection } from './GigPreferencesSection';
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

      {/* Main Content */}
      <div className="relative">
        {/* Core Profile DNA */}
        <ProfileDNASection user={user} />

        {/* Two Column Layout */}
        <div className="py-16 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content Column */}
              <div className="lg:col-span-2 space-y-16">
                {/* Professional Narrative */}
                <ProfessionalNarrativeSection user={user} />

                {/* Selected Credits */}
                <SelectedCreditsSection 
                  caseStudies={caseStudies} 
                  pastCredits={user.past_credits} 
                />
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-8 space-y-8">
                  <GigPreferencesSection user={user} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Proof */}
        <SocialProofSection inviter={inviter} />

        {/* Call to Action */}
        <CallToActionSection user={user} />
      </div>
    </div>
  );
}
