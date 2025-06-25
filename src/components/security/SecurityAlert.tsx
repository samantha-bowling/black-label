
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, AlertTriangle, Ban, Clock } from 'lucide-react';
import { AuthUser } from '@/types/auth';

interface SecurityAlertProps {
  user: AuthUser;
}

export function SecurityAlert({ user }: SecurityAlertProps) {
  const alerts = [];

  // Check for suspension
  if (user.is_suspended) {
    const expiresAt = user.suspension_expires_at ? new Date(user.suspension_expires_at) : null;
    const isActive = !expiresAt || expiresAt > new Date();
    
    if (isActive) {
      alerts.push({
        type: 'error' as const,
        icon: Ban,
        title: 'Account Suspended',
        message: expiresAt 
          ? `Your account is suspended until ${expiresAt.toLocaleDateString()}`
          : 'Your account has been permanently suspended'
      });
    }
  }

  // Check for restrictions
  if (user.gig_posting_restricted) {
    alerts.push({
      type: 'warning' as const,
      icon: AlertTriangle,
      title: 'Gig Posting Restricted',
      message: 'Your ability to post gigs has been temporarily restricted'
    });
  }

  if (user.messaging_restricted) {
    alerts.push({
      type: 'warning' as const,
      icon: AlertTriangle,
      title: 'Messaging Restricted',
      message: 'Your messaging privileges have been temporarily restricted'
    });
  }

  if (user.search_visibility_reduced) {
    alerts.push({
      type: 'info' as const,
      icon: Clock,
      title: 'Reduced Visibility',
      message: 'Your profile visibility in search results has been reduced'
    });
  }

  // Check for incomplete onboarding
  if (!user.onboarding_completed) {
    alerts.push({
      type: 'info' as const,
      icon: Shield,
      title: 'Complete Your Profile',
      message: 'Complete your profile setup to access all platform features'
    });
  }

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map((alert, index) => {
        const Icon = alert.icon;
        return (
          <Alert key={index} variant={alert.type === 'error' ? 'destructive' : 'default'}>
            <Icon className="h-4 w-4" />
            <AlertDescription>
              <strong>{alert.title}:</strong> {alert.message}
            </AlertDescription>
          </Alert>
        );
      })}
    </div>
  );
}
