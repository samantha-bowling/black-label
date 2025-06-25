
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useInvites } from "@/hooks/useInvites";
import { UserRole } from "@/types/auth";
import { 
  ButtonPrimary, 
  ButtonSecondary,
  CardLuxe, 
  HeadingLG,
  InputLuxe
} from "@/components/ui/primitives";
import { Linkedin } from "lucide-react";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [selectedRole, setSelectedRole] = useState<UserRole>("gig_seeker");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [inviteToken, setInviteToken] = useState<string>("");
  const [inviteValid, setInviteValid] = useState<boolean | null>(null);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, signUp, signInWithLinkedIn } = useAuth();
  const { validateInvite } = useInvites();

  useEffect(() => {
    const token = searchParams.get('invite');
    if (token) {
      setInviteToken(token);
      setIsSignUp(true);
      validateInviteToken(token);
    }
  }, [searchParams]);

  const validateInviteToken = async (token: string) => {
    const isValid = await validateInvite(token);
    setInviteValid(isValid);
    if (!isValid) {
      setError('Invalid or expired invite token');
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        if (!inviteToken) {
          setError('An invite token is required to sign up');
          setLoading(false);
          return;
        }

        if (inviteValid === false) {
          setError('Invalid or expired invite token');
          setLoading(false);
          return;
        }

        const result = await signUp(email, password, displayName, selectedRole, inviteToken);
        if (result.error) {
          setError(result.error);
        } else {
          setEmail("");
          setPassword("");
          setDisplayName("");
        }
      } else {
        const result = await signIn(email, password);
        if (result.error) {
          setError(result.error);
        } else {
          navigate("/dashboard");
        }
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleLinkedInAuth = async () => {
    setError(null);
    setLoading(true);
    
    try {
      const result = await signInWithLinkedIn();
      if (result.error) {
        setError(result.error);
      }
    } catch (err: any) {
      setError(err.message || "LinkedIn authentication failed");
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
              <img 
                src="/lovable-uploads/5c266225-a588-440b-b158-3bb0d529a94f.png" 
                alt="BlackLabel" 
                className="h-8"
              />
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
            {isSignUp && inviteToken && (
              <div className="mt-4 p-3 bg-primary/20 border border-primary/30 rounded-md">
                <p className="text-primary text-sm">
                  {inviteValid === true 
                    ? '✓ Valid invite token' 
                    : inviteValid === false 
                    ? '✗ Invalid invite token' 
                    : 'Validating invite...'}
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            {isSignUp && (
              <div>
                <label htmlFor="inviteToken" className="block text-sm font-medium mb-2">
                  Invite Token *
                </label>
                <InputLuxe
                  id="inviteToken"
                  type="text"
                  value={inviteToken}
                  onChange={(e) => {
                    setInviteToken(e.target.value);
                    if (e.target.value) {
                      validateInviteToken(e.target.value);
                    }
                  }}
                  placeholder="Enter your invite token"
                  required
                  error={inviteValid === false}
                />
              </div>
            )}

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
              <>
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium mb-2">
                    Display Name
                  </label>
                  <InputLuxe
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Enter your display name"
                    required
                    error={!!error}
                  />
                </div>

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
              </>
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
              disabled={isSignUp && (inviteValid === false || !inviteToken)}
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </ButtonPrimary>
          </form>

          {!isSignUp && (
            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>
              
              <ButtonSecondary
                onClick={handleLinkedInAuth}
                className="w-full mt-4"
                isLoading={loading}
                size="lg"
              >
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </ButtonSecondary>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-primary hover:text-primary-muted transition-colors"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Have an invite? Sign up"
              }
            </button>
          </div>
        </CardLuxe>
      </div>
    </div>
  );
};

export default Auth;
