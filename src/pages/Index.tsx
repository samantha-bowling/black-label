
import { useNavigate } from "react-router-dom";
import { ButtonPrimary, ButtonSecondary } from "@/components/ui/primitives";
import { PrivacyPolicyModal, TermsOfServiceModal, AboutModal } from "@/components/legal/LegalModals";
import { ContactModal } from "@/components/contact/ContactModal";
import { Archive, BookOpen } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="nav-glass fixed top-0 w-full z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/5c266225-a588-440b-b158-3bb0d529a94f.png" 
              alt="BLACKLABEL.gg" 
              className="h-8"
            />
          </div>
          <div className="flex items-center space-x-4">
            <ButtonSecondary onClick={() => navigate("/case-study")}>
              Case Study
            </ButtonSecondary>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 md:pt-40 pb-16">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-center animate-fade-in">
              <img 
                src="/lovable-uploads/3928092b-3c56-44d8-ab8a-e32eab280559.png" 
                alt="BLACKLABEL.gg" 
                className="h-24 md:h-32 lg:h-40"
              />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-surface text-muted-foreground text-sm animate-fade-in">
              <Archive className="w-4 h-4" />
              <span>This project has been sunset</span>
            </div>

            <div className="space-y-4 animate-fade-in">
              <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-foreground uppercase tracking-wide">
                The Premier Talent Platform for Games
              </h1>

              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                BLACKLABEL.gg was an invite-only platform connecting top-tier gaming professionals 
                with studios for contract, consulting, and freelance work—built by veterans who 
                know what it takes to ship.
              </p>

              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                BLACKLABEL.gg featured role-branching onboarding, 
                editorial profiles, curated gig matching, and a full moderation system. 
                It has since been archived as a technical portfolio piece.
              </p>
            </div>

            <div className="flex flex-col items-center gap-4 animate-fade-in pt-4">
              <ButtonPrimary 
                size="lg" 
                onClick={() => navigate("/case-study")}
                className="group hover:shadow-glow transition-all duration-300 w-full max-w-sm h-auto py-4"
              >
                <div className="flex items-center justify-center gap-3">
                  <BookOpen className="w-5 h-5" />
                  <div className="text-center leading-tight">
                    <div className="text-base font-bold">Read the Technical Case Study</div>
                    <div className="text-sm font-semibold opacity-80">Architecture, design system & lessons learned</div>
                  </div>
                </div>
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </section>

      {/* What It Was Section */}
      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-foreground uppercase tracking-wide text-center mb-12">
              What BLACKLABEL.gg Was
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-foreground rounded-xl mx-auto flex items-center justify-center">
                  <span className="text-background text-xl font-bold">1</span>
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground">Invite-Only Access</h3>
                <p className="text-muted-foreground text-sm">
                  A curated ecosystem where verified game professionals joined by referral, 
                  ensuring quality and trust in every connection.
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-foreground rounded-xl mx-auto flex items-center justify-center">
                  <span className="text-background text-xl font-bold">2</span>
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground">Editorial Profiles</h3>
                <p className="text-muted-foreground text-sm">
                  Rich, narrative-driven profiles with project showcases, game credits, 
                  collaboration preferences, and "Profile DNA" tags.
                </p>
              </div>
              <div className="text-center space-y-3">
                <div className="w-12 h-12 bg-foreground rounded-xl mx-auto flex items-center justify-center">
                  <span className="text-background text-xl font-bold">3</span>
                </div>
                <h3 className="font-display font-semibold text-lg text-foreground">Curated Gig Matching</h3>
                <p className="text-muted-foreground text-sm">
                  Only active, funded, and well-scoped opportunities. Admin-approved postings 
                  with role-based access for seekers and posters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Closing */}
      <section className="py-16 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/5 to-transparent"></div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-3xl mx-auto space-y-4">
            <h2 className="font-display font-bold text-3xl md:text-4xl lg:text-5xl text-foreground uppercase tracking-wide">
              WHITEGLOVE. BLACKLABEL.
            </h2>
            <p className="text-muted-foreground text-lg">
              Where credibility met craft. — 2024–2025
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/5c266225-a588-440b-b158-3bb0d529a94f.png" 
                alt="BLACKLABEL.gg" 
                className="h-6"
              />
            </div>
            <div className="flex items-center space-x-6">
              <AboutModal />
              <PrivacyPolicyModal />
              <TermsOfServiceModal />
              <ContactModal />
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024–2025 BLACKLABEL.gg. Archived.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
