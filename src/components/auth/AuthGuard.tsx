
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSessionStatus } from '@/hooks/useSessionStatus';
import { UserRole } from '@/types/auth';

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: UserRole;
  requireAuth?: boolean;
}

export function AuthGuard({ children, requiredRole, requireAuth = true }: AuthGuardProps) {
  const { isLoading, isAuthenticated, user } = useSessionStatus();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
