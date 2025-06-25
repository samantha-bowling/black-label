
import { useToast } from '@/hooks/use-toast';

export const createAuthToasts = () => {
  const { toast } = useToast();

  return {
    signUpSuccess: () => toast({
      title: "Sign Up Successful",
      description: "Please check your email to verify your account.",
    }),

    signUpError: (message: string) => toast({
      title: "Sign Up Failed",
      description: message,
      variant: "destructive",
    }),

    signInSuccess: () => toast({
      title: "Welcome back!",
      description: "You have successfully signed in.",
    }),

    signInError: (message: string) => toast({
      title: "Sign In Failed",
      description: message,
      variant: "destructive",
    }),

    signOutSuccess: () => toast({
      title: "Signed Out",
      description: "You have been signed out successfully.",
    }),

    onboardingSuccess: () => toast({
      title: "Profile Complete!",
      description: "Welcome to BlackLabel.gg! Your profile has been set up successfully.",
    }),

    posterOnboardingSuccess: () => toast({
      title: "Welcome to BLACKLABEL.gg!",
      description: "Your poster profile has been set up successfully.",
    }),

    genericError: (message: string) => toast({
      title: "Error",
      description: message,
      variant: "destructive",
    }),
  };
};
