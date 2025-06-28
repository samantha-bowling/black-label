
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export function AuthCallback() {
  const [searchParams] = useSearchParams();
  const { user, sessionStatus } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = () => {
      // If still loading, wait
      if (sessionStatus.isLoading) {
        return;
      }

      // If not authenticated, redirect to auth
      if (!sessionStatus.isAuthenticated) {
        navigate('/auth');
        return;
      }

      // If no user profile yet, wait a bit more
      if (!user) {
        setTimeout(handleAuthCallback, 1000);
        return;
      }

      // Now we have a user, redirect to landing page
      setIsProcessing(false);
      navigate('/');
    };

    // Start processing after a brief delay to allow auth state to settle
    const timer = setTimeout(handleAuthCallback, 500);
    
    return () => clearTimeout(timer);
  }, [sessionStatus, user, navigate]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/80">Completing authentication...</p>
        </div>
      </div>
    );
  }

  return null;
}
