
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button as BaseButton } from "@/components/ui/button";
import { Card as BaseCard } from "@/components/ui/card";

// Button Primitives with BlackLabel.gg styling
export const ButtonPrimary = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
  }
>(({ className, size = 'md', isLoading, children, ...props }, ref) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      ref={ref}
      className={cn(
        'btn-primary relative overflow-hidden transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
        sizeClasses[size],
        isLoading && 'cursor-wait',
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}
      <span className={cn(isLoading && 'opacity-0')}>
        {children}
      </span>
    </button>
  );
});
ButtonPrimary.displayName = "ButtonPrimary";

export const ButtonSecondary = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    size?: 'sm' | 'md' | 'lg';
  }
>(({ className, size = 'md', children, ...props }, ref) => {
  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base', 
    lg: 'px-8 py-4 text-lg'
  };

  return (
    <button
      ref={ref}
      className={cn(
        'btn-secondary',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
});
ButtonSecondary.displayName = "ButtonSecondary";

// Card Primitives
export const CardLuxe = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    glow?: boolean;
    interactive?: boolean;
  }
>(({ className, glow, interactive, children, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'card-luxe',
        glow && 'glow-primary',
        interactive && 'cursor-pointer hover:scale-[1.02] transition-transform duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
CardLuxe.displayName = "CardLuxe";

// Badge Primitives
export const BadgeBeta = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement>
>(({ className, children, ...props }, ref) => {
  return (
    <span
      ref={ref}
      className={cn('badge-beta', className)}
      {...props}
    >
      {children}
    </span>
  );
});
BadgeBeta.displayName = "BadgeBeta";

export const BadgeStatus = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    variant?: 'success' | 'warning' | 'error' | 'info';
  }
>(({ className, variant = 'info', children, ...props }, ref) => {
  const variantClasses = {
    success: 'bg-success/20 text-success border-success/30',
    warning: 'bg-warning/20 text-warning border-warning/30',
    error: 'bg-destructive/20 text-destructive border-destructive/30',
    info: 'bg-primary/20 text-primary border-primary/30'
  };

  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        variantClasses[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});
BadgeStatus.displayName = "BadgeStatus";

// Input Primitives
export const InputLuxe = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    error?: boolean;
  }
>(({ className, error, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'input-luxe',
        error && 'border-destructive focus:border-destructive',
        className
      )}
      {...props}
    />
  );
});
InputLuxe.displayName = "InputLuxe";

// Typography Primitives
export const HeadingXL = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    as?: 'h1' | 'h2' | 'h3';
    gradient?: boolean;
    glow?: boolean;
  }
>(({ className, as: Component = 'h1', gradient, glow, children, ...props }, ref) => {
  return (
    <Component
      ref={ref}
      className={cn(
        'heading-xl',
        gradient && 'text-gradient-primary',
        glow && 'text-glow',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});
HeadingXL.displayName = "HeadingXL";

export const HeadingLG = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    as?: 'h2' | 'h3' | 'h4';
  }
>(({ className, as: Component = 'h2', children, ...props }, ref) => {
  return (
    <Component
      ref={ref}
      className={cn('heading-lg', className)}
      {...props}
    >
      {children}
    </Component>
  );
});
HeadingLG.displayName = "HeadingLG";

// Loading Primitives
export const LoadingLine = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'h-1 w-full rounded-full loading-line',
        className
      )}
      {...props}
    />
  );
});
LoadingLine.displayName = "LoadingLine";

export const LoadingSpinner = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'md' | 'lg';
  }
>(({ className, size = 'md', ...props }, ref) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div
      ref={ref}
      className={cn(
        'border-2 border-primary/30 border-t-primary rounded-full animate-spin',
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
});
LoadingSpinner.displayName = "LoadingSpinner";
