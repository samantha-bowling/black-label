import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useInvites } from "@/hooks/useInvites";
import { UserRole } from "@/types/auth";
import { 
  ButtonPrimary, 
  CardLuxe, 
  HeadingLG,
} from "@/components/ui/primitives";
import { AuthFormField } from "@/components/forms/AuthFormField";
import { 
  getSignUpTitle, 
  getSignUpDescription, 
  shouldDisableSubmit 
} from "@/lib/auth/authUtils";

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

        const result = await signUp(
          email, 
          password, 
          displayName, 
          intendedRole || 'gig_poster',
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
              {isSignUp ? getSignUpTitle(intendedRole) : 'Welcome Back'}
            </HeadingLG>
            <p className="text-muted-foreground">
              {isSignUp ? getSignUpDescription(intendedRole) : 'Access your elite gaming network'}
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
              <AuthFormField
                id="inviteToken"
                label="Invite Token"
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
            )}

            <AuthFormField
              id="email"
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              error={!!error}
            />

            <AuthFormField
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              error={!!error}
            />

            {isSignUp && (
              <AuthFormField
                id="displayName"
                label="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Enter your display name"
                required
                error={!!error}
              />
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
              disabled={shouldDisableSubmit(isSignUp, intendedRole, inviteValid, inviteToken)}
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
