
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { OnboardingFlow } from '@/components/onboarding/OnboardingFlow';
import { useEffect } from 'react';

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if user is not authenticated
    if (!user) {
      navigate('/auth');
      return;
    }

    // Redirect if onboarding is already completed
    if (user.onboarding_completed) {
      navigate('/dashboard');
      return;
    }
  }, [user, navigate]);

  const handleOnboardingComplete = () => {
    // Redirect to dashboard after successful completion
    navigate('/dashboard');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/80">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <OnboardingFlow 
        userRole={user.role!} 
        onComplete={handleOnboardingComplete} 
      />
    </div>
  );
};

export default Onboarding;
