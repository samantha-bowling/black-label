
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
import { Star, ArrowUp, ChevronRight } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="nav-glass fixed top-0 w-full z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-md"></div>
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
      <section className="hero-section pt-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <BadgeBeta className="mb-6">
              Invite Only Beta
            </BadgeBeta>
            
            <HeadingXL gradient glow className="mb-6">
              Elite Gaming Talent Platform
            </HeadingXL>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Connect with proven creators. Vetted projects. No filler.
              <br />
              <span className="text-primary font-medium">Where elite gaming talent meets ambitious projects.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <ButtonPrimary 
                size="lg" 
                onClick={() => navigate("/auth")}
                className="group"
              >
                Join BlackLabel.gg
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </ButtonPrimary>
              <ButtonSecondary size="lg">
                View Showcase
              </ButtonSecondary>
            </div>
            
            {/* Trust Indicators */}
            <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Star className="w-4 h-4 text-primary" />
                <span>Elite Creators</span>
              </div>
              <div className="flex items-center space-x-2">
                <ArrowUp className="w-4 h-4 text-success" />
                <span>Vetted Projects</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span>Invite Only</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <HeadingLG className="mb-4">
              Built for Gaming Excellence
            </HeadingLG>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              A curated ecosystem where top-tier gaming professionals connect with ambitious projects.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <CardLuxe className="text-center group hover:glow-primary transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl mx-auto mb-6 flex items-center justify-center">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display font-semibold text-xl mb-4">Elite Network</h3>
              <p className="text-muted-foreground mb-4">
                Access proven professionals with track records in AAA studios, indie successes, and esports.
              </p>
              <BadgeStatus variant="success">Verified Talent</BadgeStatus>
            </CardLuxe>
            
            <CardLuxe className="text-center group hover:glow-primary transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl mx-auto mb-6 flex items-center justify-center">
                <ArrowUp className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-display font-semibold text-xl mb-4">Curated Projects</h3>
              <p className="text-muted-foreground mb-4">
                Only legitimate opportunities from established studios and well-funded indie teams.
              </p>
              <BadgeStatus variant="info">Quality Guaranteed</BadgeStatus>
            </CardLuxe>
            
            <CardLuxe className="text-center group hover:glow-primary transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl mx-auto mb-6 flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              </div>
              <h3 className="font-display font-semibold text-xl mb-4">Exclusive Access</h3>
              <p className="text-muted-foreground mb-4">
                Invitation-only platform ensuring quality connections and meaningful collaborations.
              </p>
              <BadgeStatus variant="warning">Invite Only</BadgeStatus>
            </CardLuxe>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
        <div className="container mx-auto px-4 text-center relative">
          <div className="max-w-3xl mx-auto">
            <HeadingLG className="mb-6">
              Ready to elevate your gaming career?
            </HeadingLG>
            <p className="text-muted-foreground mb-8 text-lg">
              Join the most exclusive network of gaming professionals and discover opportunities 
              that match your expertise and ambition.
            </p>
            <ButtonPrimary size="lg" onClick={() => navigate("/auth")}>
              Request Invitation
            </ButtonPrimary>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-gradient-primary rounded"></div>
              <span className="font-display font-bold">BlackLabel.gg</span>
            </div>
            <div className="text-sm text-muted-foreground">
              © 2024 BlackLabel.gg. Elite gaming talent platform.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
