
import { useAuth } from '@/hooks/useAuth';
import { AppLayout, PageHeader } from '@/components/layout/AppLayout';
import { LeadDashboard } from '@/components/leads/LeadDashboard';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { TrendingUp } from 'lucide-react';

export default function Leads() {
  const { user } = useAuth();

  return (
    <AuthGuard requireAuth>
      <AppLayout>
        <PageHeader
          title="Lead Management"
          subtitle="Track and manage your profile inquiries and project leads"
        />
        
        <LeadDashboard />
      </AppLayout>
    </AuthGuard>
  );
}
