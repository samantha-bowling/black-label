
import { ReactNode } from 'react';
import { Container, Section } from '@/components/ui/design-primitives';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: ReactNode;
  variant?: 'default' | 'centered' | 'sidebar' | 'full';
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

export function AppLayout({ 
  children, 
  variant = 'default', 
  className,
  maxWidth = 'xl' 
}: AppLayoutProps) {
  const layoutClasses = {
    default: 'min-h-screen bg-[#0B0C10]',
    centered: 'min-h-screen bg-[#0B0C10] flex items-center justify-center',
    sidebar: 'min-h-screen bg-[#0B0C10] flex',
    full: 'min-h-screen bg-[#0B0C10] w-full'
  };

  if (variant === 'centered') {
    return (
      <div className={cn(layoutClasses[variant], className)}>
        <Container size={maxWidth}>
          {children}
        </Container>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={cn(layoutClasses[variant], className)}>
        {children}
      </div>
    );
  }

  return (
    <div className={cn(layoutClasses[variant], className)}>
      <Container size={maxWidth}>
        <Section>
          {children}
        </Section>
      </Container>
    </div>
  );
}

// Page header component for consistent page titles
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  breadcrumb?: ReactNode;
  className?: string;
}

export function PageHeader({ 
  title, 
  subtitle, 
  action, 
  breadcrumb, 
  className 
}: PageHeaderProps) {
  return (
    <div className={cn('mb-8', className)}>
      {breadcrumb && (
        <div className="mb-4">
          {breadcrumb}
        </div>
      )}
      
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="font-display font-bold text-3xl lg:text-4xl text-white uppercase tracking-wide">
            {title}
          </h1>
          {subtitle && (
            <p className="text-white/70 text-lg max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
        
        {action && (
          <div className="flex-shrink-0 ml-6">
            {action}
          </div>
        )}
      </div>
    </div>
  );
}

// Content wrapper for consistent spacing
interface ContentWrapperProps {
  children: ReactNode;
  spacing?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function ContentWrapper({ 
  children, 
  spacing = 'lg', 
  className 
}: ContentWrapperProps) {
  const spacingClasses = {
    sm: 'space-y-4',
    md: 'space-y-6',
    lg: 'space-y-8',
    xl: 'space-y-12'
  };

  return (
    <div className={cn(spacingClasses[spacing], className)}>
      {children}
    </div>
  );
}
