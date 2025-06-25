
import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

interface FormSectionProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  badge?: string;
  infoMessage?: {
    title: string;
    description: string;
    variant?: 'info' | 'warning' | 'success';
  };
  children: ReactNode;
  className?: string;
}

export function FormSection({ 
  title, 
  subtitle, 
  icon, 
  badge, 
  infoMessage, 
  children, 
  className = '' 
}: FormSectionProps) {
  const getInfoVariantStyles = (variant: 'info' | 'warning' | 'success' = 'info') => {
    switch (variant) {
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-300';
      case 'success':
        return 'bg-green-500/10 border-green-500/20 text-green-300';
      default:
        return 'bg-blue-500/10 border-blue-500/20 text-blue-300';
    }
  };

  return (
    <Card className={`bg-black/20 border-white/20 ${className}`}>
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          {icon && icon}
          <span>{title}</span>
          {badge && (
            <span className="text-xs bg-white/10 px-2 py-1 rounded-full">
              {badge}
            </span>
          )}
        </CardTitle>
        {subtitle && (
          <p className="text-white/70 text-sm">{subtitle}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {infoMessage && (
          <div className={`border rounded-lg p-4 ${getInfoVariantStyles(infoMessage.variant)}`}>
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium">{infoMessage.title}</p>
                <p className="mt-1 opacity-80">{infoMessage.description}</p>
              </div>
            </div>
          </div>
        )}
        {children}
      </CardContent>
    </Card>
  );
}
