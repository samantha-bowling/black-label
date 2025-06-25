
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { 
  ButtonPrimary, 
  ButtonSecondary, 
  CardLuxe, 
  BadgeBeta, 
  BadgeStatus,
  HeadingXL,
  HeadingLG
} from "@/components/ui/primitives";
import { Star, Shield, CheckCircle, ChevronRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="nav-glass fixed top-0 w-full z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white rounded-md"></div>
            <span className="font-display font-bold text-xl">BlackLabel.gg</span>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <ButtonSecondary onClick={() => navigate("/dashboard")}>
                Dashboard
              </ButtonSecondary>
            ) : (
              <>
                <ButtonSecondary onClick={() => navigate("/auth")}>
                  Sign In
                </ButtonSecondary>
                <ButtonPrimary onClick={() => navigate("/auth")}>
                  Join Beta
                </ButtonPrimary>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section pt-16 md:pt-20 pb-8">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <BadgeBeta className="animate-fade-in">
              Invite-Only Beta
            </BadgeBeta>
            
            <HeadingXL glow className="animate-fade-in">
              The Premier Talent Platform for Games
            </HeadingXL>
            
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto animate-fade-in">
              Connect with top-tier professionals and studios for contract, consulting, and freelance work—built by veterans who know what it takes to ship.
            </p>
            
            <p className="text-lg text-white font-medium animate-fade-in">
              Where verified creators and real opportunities meet.
            </p>
            
            <div className="flex justify-center animate-fade-in">
              <ButtonPrimary 
                size="lg" 
                onClick={() => navigate("/auth")}
                className="group hover:shadow-glow transition-all duration-300"
              >
                Join BlackLabel.gg
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </ButtonPrimary>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground animate-fade-in pt-4">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-white" />
                <span>Verified Talent</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-white" />
                <span>Real Opportunities</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span>By Referral</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 space-y-4">
            <HeadingLG>
              Built for Gaming Excellence
            </HeadingLG>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A curated ecosystem where proven game professionals connect with ambitious teams.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <CardLuxe className="text-center group hover:glow-primary transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-xl mx-auto mb-6 flex items-center justify-center">
                <Star className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-display font-semibold text-xl mb-4">Verified Talent</h3>
              <p className="text-muted-foreground mb-4">
                Work with trusted experts from AAA studios, indie gems, and competitive esports.
              </p>
              <BadgeStatus variant="success">Verified</BadgeStatus>
            </CardLuxe>
            
            <CardLuxe className="text-center group hover:glow-primary transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-xl mx-auto mb-6 flex items-center justify-center">
                <Shield className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-display font-semibold text-xl mb-4">Real Opportunities</h3>
              <p className="text-muted-foreground mb-4">
                Only active, funded, and well-scoped gigs. No filler, no ghost jobs.
              </p>
              <BadgeStatus variant="info">Curated</BadgeStatus>
            </CardLuxe>
            
            <CardLuxe className="text-center group hover:glow-primary transition-all duration-300">
              <div className="w-12 h-12 bg-white rounded-xl mx-auto mb-6 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-black" />
              </div>
              <h3 className="font-display font-semibold text-xl mb-4">Trusted Access</h3>
              <p className="text-muted-foreground mb-4">
                Invite-only platform to ensure meaningful matches and lasting collaborations.
              </p>
              <BadgeStatus variant="warning">By Referral</BadgeStatus>
            </CardLuxe>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-transparent"></div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-3xl mx-auto space-y-6">
            <HeadingLG>
              You're in Good Company.
            </HeadingLG>
            <p className="text-muted-foreground text-lg">
              Join a curated network of game dev professionals working on meaningful, paid projects. 
              Invite-only, built for trust.
            </p>
            <ButtonPrimary 
              size="lg" 
              onClick={() => navigate("/auth")}
              className="hover:shadow-glow transition-all duration-300"
            >
              Request an Invite
            </ButtonPrimary>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-white rounded"></div>
              <span className="font-display font-bold">BlackLabel.gg</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 BlackLabel.gg. The premier talent platform for games.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
