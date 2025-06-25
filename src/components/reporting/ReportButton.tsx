
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ReportUserModal } from './ReportUserModal';
import { AuthUser } from '@/types/auth';
import { Flag } from 'lucide-react';

interface ReportButtonProps {
  reportedUser: AuthUser;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  showIcon?: boolean;
  children?: React.ReactNode;
}

export function ReportButton({ 
  reportedUser, 
  variant = 'outline', 
  size = 'sm',
  showIcon = true,
  children 
}: ReportButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setIsModalOpen(true)}
        className="text-red-600 hover:text-red-700"
      >
        {showIcon && <Flag className="h-4 w-4 mr-2" />}
        {children || 'Report User'}
      </Button>

      <ReportUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        reportedUser={reportedUser}
      />
    </>
  );
}
