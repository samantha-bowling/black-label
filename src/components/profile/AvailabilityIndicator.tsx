
import { Badge } from '@/components/ui/badge';
import { Circle } from 'lucide-react';

interface AvailabilityIndicatorProps {
  status?: string;
  className?: string;
}

const AVAILABILITY_CONFIG = {
  available: {
    label: 'Available',
    color: 'bg-green-500',
    badgeClass: 'bg-green-100 text-green-800 hover:bg-green-200',
  },
  busy: {
    label: 'Busy',
    color: 'bg-yellow-500',
    badgeClass: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
  },
  unavailable: {
    label: 'Unavailable',
    color: 'bg-red-500',
    badgeClass: 'bg-red-100 text-red-800 hover:bg-red-200',
  },
  selective: {
    label: 'Selective',
    color: 'bg-blue-500',
    badgeClass: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
  },
} as const;

export function AvailabilityIndicator({ status, className = '' }: AvailabilityIndicatorProps) {
  if (!status || !(status in AVAILABILITY_CONFIG)) {
    return null;
  }

  const config = AVAILABILITY_CONFIG[status as keyof typeof AVAILABILITY_CONFIG];

  return (
    <Badge className={`${config.badgeClass} ${className}`}>
      <Circle className={`w-2 h-2 mr-1 ${config.color}`} fill="currentColor" />
      {config.label}
    </Badge>
  );
}
