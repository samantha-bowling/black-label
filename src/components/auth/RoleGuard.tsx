
import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useRoleAccess } from '@/hooks/useRoleAccess';
import { UserRole } from '@/types/auth';

interface RoleGuardProps {
  children: ReactNode;
  requiredRole?: UserRole;
  requireCapability?: keyof ReturnType<typeof useRoleAccess>;
  fallbackPath?: string;
  showAccessDenied?: boolean;
}

export function RoleGuard({ 
  children, 
  requiredRole, 
  requireCapability,
  fallbackPath = '/dashboard',
  showAccessDenied = true 
}: RoleGuardProps) {
  const roleAccess = useRoleAccess();
  const location = useLocation();

  // Check role requirement
  if (requiredRole && !roleAccess.hasRole(requiredRole)) {
    if (showAccessDenied) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
            <p className="text-white/80">You don't have permission to access this page.</p>
            <p className="text-white/60 text-sm mt-2">Required role: {requiredRole}</p>
          </div>
        </div>
      );
    }
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  // Check capability requirement
  if (requireCapability && !roleAccess[requireCapability]) {
    if (showAccessDenied) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
            <p className="text-white/80">You don't have the required capability to access this page.</p>
            <p className="text-white/60 text-sm mt-2">Required capability: {requireCapability}</p>
          </div>
        </div>
      );
    }
    return <Navigate to={fallbackPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
