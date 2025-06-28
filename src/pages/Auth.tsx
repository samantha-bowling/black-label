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
import { PasswordField } from "@/components/forms/PasswordField";
import { checkPasswordStrength } from "@/lib/auth/passwordUtils";
import { 
  getSignUpTitle, 
  getSignUpDescription, 
  shouldDisableSubmit 
} from "@/lib/auth/authUtils";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [inviteToken, setInviteToken] = useState<string>("");
  const [inviteValid, setInviteValid] = useState<boolean | null>(null);
  const [intendedRole, setIntendedRole] = useState<UserRole | null>(null);
  const [authMode, setAuthMode] = useState<'signup' | 'signin'>('signup');
  const [validationDetails, setValidationDetails] = useState<string>("");
  const [validationInProgress, setValidationInProgress] = useState(false);
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { signIn, signUp, sessionStatus } = useAuth();
  const { validateInvite } = useInvites();

  // Redirect authenticated users
  useEffect(() => {
    if (sessionStatus.isAuthenticated && sessionStatus.user) {
      navigate('/auth/callback');
    }
  }, [sessionStatus, navigate]);

  useEffect(() => {
    const token = searchParams.get('invite');
    const roleParam = searchParams.get('role');
    const modeParam = searchParams.get('mode');
    
    if (modeParam === 'signin') {
      setAuthMode('signin');
      setIsSignUp(false);
    } else {
      setAuthMode('signup');
      setIsSignUp(true);
    }
    
    if (token) {
      setInviteToken(token);
      setIsSignUp(true);
      setIntendedRole('gig_seeker');
      validateInviteToken(token);
    } else if (roleParam === 'poster') {
      setIsSignUp(true);
      setIntendedRole('gig_poster');
    } else if (!modeParam) {
      setIntendedRole('gig_seeker');
    }
  }, [searchParams]);

  const validateInviteToken = async (token: string) => {
    console.log('🔍 Starting comprehensive invite validation for token:', token);
    setValidationInProgress(true);
    setValidationDetails("🔍 Validating invite token...");
    setError(null);
    
    try {
      console.log('Token details:', {
        length: token.length,
        containsDashes: token.includes('-'),
        format: token
      });

      const isValid = await validateInvite(token);
      console.log('✨ Final validation result:', isValid);
      
      setInviteValid(isValid);
      setValidationInProgress(false);
      
      if (!isValid) {
        setError('❌ Invalid, expired, or already used invite token');
        setValidationDetails("❌ Validation failed - token may be invalid, expired, or already used");
      } else {
        setError(null);
        setValidationDetails("✅ Valid invite token - ready to proceed with signup");
      }
    } catch (error) {
      console.error('💥 Validation error:', error);
      setInviteValid(false);
      setValidationInProgress(false);
      const errorMsg = error instanceof Error ? error.message : 'Unknown validation error';
      setError(`❌ Validation error: ${errorMsg}`);
      setValidationDetails(`❌ Technical error during validation: ${errorMsg}`);
    }
  };

  const validatePasswords = (): string | null => {
    if (!isSignUp) return null;
    
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    
    const strength = checkPasswordStrength(password);
    if (strength.score < 2) {
      return 'Password is too weak. Please follow the strength requirements.';
    }
    
    return null;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (isSignUp) {
      const passwordError = validatePasswords();
      if (passwordError) {
        setError(passwordError);
        return;
      }
    }

    setLoading(true);

    try {
      if (isSignUp) {
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
          setConfirmPassword("");
          setDisplayName("");
        }
      } else {
        const result = await signIn(email, password);
        if (result.error) {
          setError(result.error);
        }
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
    setIsSignUp(authMode === 'signin');
    setError(null);
    setPassword("");
    setConfirmPassword("");
  };

  const switchRole = () => {
    const newRole = intendedRole === 'gig_poster' ? 'gig_seeker' : 'gig_poster';
    if (newRole === 'gig_poster') {
      navigate('/auth?role=poster');
    } else {
      navigate('/auth');
    }
  };

  const getFlowIndicator = () => {
    if (!isSignUp) return null;
    
    return (
      <div className="flex items-center justify-center space-x-2 mb-4">
        <div className={`px-3 py-1 rounded-full text-xs font-medium ${
          intendedRole === 'gig_poster' 
            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
            : 'bg-green-500/20 text-green-400 border border-green-500/30'
        }`}>
          {intendedRole === 'gig_poster' ? 'Poster Signup' : 'Talent Signup'}
        </div>
      </div>
    );
  };

  const isFormValid = () => {
    if (!isSignUp) return true;
    
    const strength = checkPasswordStrength(password);
    return password === confirmPassword && strength.score >= 2;
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
            
            {getFlowIndicator()}
            
            <HeadingLG as="h2" className="mb-2">
              {isSignUp ? getSignUpTitle(intendedRole) : 'Welcome Back'}
            </HeadingLG>
            <p className="text-muted-foreground">
              {isSignUp ? getSignUpDescription(intendedRole) : 'Access your elite gaming network'}
            </p>
            {isSignUp && inviteToken && (
              <div className="mt-4 p-3 bg-primary/20 border border-primary/30 rounded-md">
                <p className={`text-sm font-medium ${
                  validationInProgress ? 'text-yellow-400' : 
                  inviteValid === true ? 'text-green-400' : 
                  inviteValid === false ? 'text-red-400' : 'text-primary'
                }`}>
                  {validationDetails}
                </p>
                {validationInProgress && (
                  <div className="mt-2 flex items-center text-xs text-yellow-300">
                    <div className="animate-spin w-3 h-3 border border-yellow-400 border-t-transparent rounded-full mr-2"></div>
                    Checking token validity...
                  </div>
                )}
                {inviteValid === false && (
                  <div className="mt-2">
                    <p className="text-destructive text-xs">
                      Please check your invite link or contact support
                    </p>
                    <button
                      onClick={() => validateInviteToken(inviteToken)}
                      className="text-xs text-primary hover:text-primary-muted mt-1 underline"
                      disabled={validationInProgress}
                    >
                      Retry validation
                    </button>
                  </div>
                )}
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

            <PasswordField
              id="password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              error={!!error}
              showStrengthIndicator={isSignUp}
            />

            {isSignUp && (
              <PasswordField
                id="confirmPassword"
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                error={!!error || (confirmPassword && password !== confirmPassword)}
              />
            )}

            {isSignUp && intendedRole === 'gig_poster' && (
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
              disabled={
                shouldDisableSubmit(isSignUp, intendedRole, inviteValid, inviteToken) || 
                (isSignUp && !isFormValid()) ||
                validationInProgress
              }
            >
              {isSignUp ? 'Create Account' : 'Sign In'}
            </ButtonPrimary>
          </form>

          <div className="mt-6 space-y-3 text-center">
            <button
              onClick={toggleAuthMode}
              className="text-sm text-primary hover:text-primary-muted transition-colors"
            >
              {isSignUp
                ? 'Already have an account? Sign in'
                : "Need an account? Sign up"
              }
            </button>
            
            {isSignUp && (
              <div className="text-center">
                <button
                  onClick={switchRole}
                  className="text-xs text-muted-foreground hover:text-white transition-colors"
                >
                  Wrong path? Switch to {intendedRole === 'gig_poster' ? 'talent signup' : 'poster signup'}
                </button>
              </div>
            )}
          </div>
        </CardLuxe>
      </div>
    </div>
  );
};

export default Auth;
