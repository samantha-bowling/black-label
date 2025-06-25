
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

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [inviteToken, setInviteToken] = useState<string>("");
  const [inviteValid, setInviteValid] = useState<boolean | null>(null);
  const [intendedRole, setIntendedRole] = useState<UserRole | null>(null);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, signUp } = useAuth();
  const { validateInvite } = useInvites();

  useEffect(() => {
    const token = searchParams.get('invite');
    const roleParam = searchParams.get('role');
    
    if (token) {
      // User came via invite - they're a seeker
      setInviteToken(token);
      setIsSignUp(true);
      setIntendedRole('gig_seeker');
      validateInviteToken(token);
    } else if (roleParam === 'poster') {
      // User came wanting to post gigs - they're a poster
      setIsSignUp(true);
      setIntendedRole('gig_poster');
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
        // For seekers, require invite token
        if (intendedRole === 'gig_seeker') {
          if (!inviteToken) {
            setError('An invite token is required to sign up as a talent seeker');
            setLoading(false);
            return;
          }

          if (inviteValid === false) {
            setError('Invalid or expired invite token');
            setLoading(false);
            return;
          }
        }

        // Use the intended role for signup
        const result = await signUp(
          email, 
          password, 
          displayName, 
          intendedRole || 'gig_poster', // Default to poster if no role specified
          inviteToken || undefined
        );
        
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

  const getSignUpTitle = () => {
    if (intendedRole === 'gig_seeker') {
      return 'Join as Gaming Talent';
    } else if (intendedRole === 'gig_poster') {
      return 'Join as Project Creator';
    }
    return 'Join the Elite';
  };

  const getSignUpDescription = () => {
    if (intendedRole === 'gig_seeker') {
      return 'Complete your invite-only registration to access exclusive gaming opportunities';
    } else if (intendedRole === 'gig_poster') {
      return 'Set up your account to start posting gigs and finding talent';
    }
    return 'Enter the most exclusive gaming talent network';
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
              {isSignUp ? getSignUpTitle() : 'Welcome Back'}
            </HeadingLG>
            <p className="text-muted-foreground">
              {isSignUp ? getSignUpDescription() : 'Access your elite gaming network'}
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
            {isSignUp && intendedRole === 'gig_seeker' && (
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
              disabled={isSignUp && intendedRole === 'gig_seeker' && (inviteValid === false || !inviteToken)}
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
