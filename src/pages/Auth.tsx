
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSession } from '@/hooks/useSession';
import { ButtonPrimary, InputLuxe, CardLuxe, HeadingXL } from '@/components/ui/primitives';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Linkedin } from 'lucide-react';

interface AuthFormData {
  email: string;
  password: string;
  displayName?: string;
}

export default function Auth() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp, signInWithLinkedIn, user } = useSession();
  const navigate = useNavigate();
  
  const form = useForm<AuthFormData>();

  // Redirect if already authenticated
  if (user) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (data: AuthFormData) => {
    setIsLoading(true);
    
    try {
      let result;
      
      if (isSignUp) {
        if (!data.displayName?.trim()) {
          form.setError('displayName', { message: 'Display name is required' });
          return;
        }
        result = await signUp(data.email, data.password, data.displayName);
      } else {
        result = await signIn(data.email, data.password);
      }

      if (!result.error) {
        navigate('/dashboard');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkedInSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithLinkedIn();
      if (!result.error) {
        // LinkedIn redirect will handle navigation
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <CardLuxe className="w-full max-w-md p-8 space-y-6">
        <div className="text-center space-y-2">
          <HeadingXL className="text-white" gradient>
            {isSignUp ? 'Join BlackLabel.gg' : 'Welcome Back'}
          </HeadingXL>
          <p className="text-white/70">
            {isSignUp ? 'Create your account to get started' : 'Sign in to your account'}
          </p>
        </div>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {isSignUp && (
            <div>
              <Label htmlFor="displayName" className="text-white">
                Display Name
              </Label>
              <InputLuxe
                id="displayName"
                type="text"
                placeholder="How should we call you?"
                {...form.register('displayName', { required: 'Display name is required' })}
                error={!!form.formState.errors.displayName}
              />
              {form.formState.errors.displayName && (
                <p className="text-destructive text-sm mt-1">
                  {form.formState.errors.displayName.message}
                </p>
              )}
            </div>
          )}

          <div>
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <InputLuxe
              id="email"
              type="email"
              placeholder="Enter your email"
              {...form.register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Please enter a valid email'
                }
              })}
              error={!!form.formState.errors.email}
            />
            {form.formState.errors.email && (
              <p className="text-destructive text-sm mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="password" className="text-white">
              Password
            </Label>
            <InputLuxe
              id="password"
              type="password"
              placeholder="Enter your password"
              {...form.register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
              error={!!form.formState.errors.password}
            />
            {form.formState.errors.password && (
              <p className="text-destructive text-sm mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <ButtonPrimary
            type="submit"
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            {isSignUp ? 'Create Account' : 'Sign In'}
          </ButtonPrimary>
        </form>

        <div className="space-y-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full bg-white/20" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-black px-2 text-white/60">or</span>
            </div>
          </div>

          <ButtonPrimary
            type="button"
            size="lg"
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={handleLinkedInSignIn}
            isLoading={isLoading}
          >
            <Linkedin className="w-5 h-5 mr-2" />
            Continue with LinkedIn
          </ButtonPrimary>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-white/70 hover:text-white transition-colors"
          >
            {isSignUp 
              ? 'Already have an account? Sign in' 
              : "Don't have an account? Sign up"
            }
          </button>
        </div>
      </CardLuxe>
    </div>
  );
}
