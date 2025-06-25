import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/types/auth";
import { 
  ButtonPrimary, 
  CardLuxe, 
  HeadingLG,
  InputLuxe
} from "@/components/ui/primitives";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("gig_seeker");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        await signUp(email, password, selectedRole);
      } else {
        await signIn(email, password);
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <CardLuxe className="glow-primary">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-md"></div>
              <span className="font-display font-bold text-xl">BlackLabel.gg</span>
            </div>
            <HeadingLG as="h2" className="mb-2">
              {isSignUp ? 'Join the Elite' : 'Welcome Back'}
            </HeadingLG>
            <p className="text-muted-foreground">
              {isSignUp 
                ? 'Enter the most exclusive gaming talent network' 
                : 'Access your elite gaming network'
              }
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <InputLuxe
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                error={!!error}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <InputLuxe
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                error={!!error}
              />
            </div>

            {isSignUp && (
              <div>
                <label htmlFor="role" className="block text-sm font-medium mb-2">
                  Role
                </label>
                <select
                  id="role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value as UserRole)}
                  className="input-luxe w-full"
                  required
                >
                  <option value="gig_seeker">Gig Seeker - Looking for opportunities</option>
                  <option value="gig_poster">Gig Poster - Posting projects</option>
                </select>
              </div>
            )}

            {error && (
              <div className="p-3 bg-destructive/20 border border-destructive/30 rounded-md">
                <p className="text-destructive text-sm">{error}</p>
              </div>
            )}

            <ButtonPrimary
              type="submit"
              className="w-full"
              isLoading={loading}
              size="lg"
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </ButtonPrimary>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:text-primary-muted transition-colors"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Don't have an account? Sign up"
              }
            </button>
          </div>
        </CardLuxe>
      </div>
    </div>
  );
};

export default Auth;
