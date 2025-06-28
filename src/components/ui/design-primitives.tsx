
import * as React from "react";
import { cn } from "@/lib/utils";
import { styleUtils } from "@/lib/design-system";
import { Slot } from "@radix-ui/react-slot";

// =============================================================================
// LAYOUT PRIMITIVES
// =============================================================================

export const Container = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  }
>(({ className, size = 'xl', children, ...props }, ref) => {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl', 
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <div
      ref={ref}
      className={cn(
        'mx-auto px-4 sm:px-6 lg:px-8',
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
Container.displayName = "Container";

export const Section = React.forwardRef<
  HTMLElement,
  React.HTMLAttributes<HTMLElement> & {
    spacing?: 'sm' | 'md' | 'lg' | 'xl';
  }
>(({ className, spacing = 'lg', children, ...props }, ref) => {
  const spacingClasses = {
    sm: 'py-8',
    md: 'py-12',
    lg: 'py-16', 
    xl: 'py-24'
  };

  return (
    <section
      ref={ref}
      className={cn(spacingClasses[spacing], className)}
      {...props}
    >
      {children}
    </section>
  );
});
Section.displayName = "Section";

// =============================================================================
// TYPOGRAPHY PRIMITIVES  
// =============================================================================

export const Heading = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement> & {
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
    gradient?: boolean;
    glow?: boolean;
  }
>(({ className, as: Component = 'h2', size = 'lg', gradient, glow, children, ...props }, ref) => {
  const sizeClasses = {
    xs: 'text-lg',
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl lg:text-4xl',
    xl: 'text-4xl lg:text-5xl',
    '2xl': 'text-5xl lg:text-6xl',
    '3xl': 'text-6xl lg:text-7xl',
    '4xl': 'text-7xl lg:text-8xl'
  };

  return (
    <Component
      ref={ref}
      className={cn(
        'font-display font-bold uppercase tracking-wide leading-tight',
        sizeClasses[size],
        gradient && 'bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent',
        glow && 'drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});
Heading.displayName = "Heading";

export const Text = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement> & {
    as?: 'p' | 'span' | 'div';
    size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
    variant?: 'primary' | 'secondary' | 'tertiary' | 'disabled';
    weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  }
>(({ className, as: Component = 'p', size = 'base', variant = 'primary', weight = 'normal', children, ...props }, ref) => {
  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  const variantClasses = {
    primary: 'text-white',
    secondary: 'text-white/80',
    tertiary: 'text-white/60',
    disabled: 'text-white/40'
  };

  const weightClasses = {
    normal: 'font-normal',
    medium: 'font-medium', 
    semibold: 'font-semibold',
    bold: 'font-bold'
  };

  return (
    <Component
      ref={ref}
      className={cn(
        'font-body leading-relaxed',
        sizeClasses[size],
        variantClasses[variant],
        weightClasses[weight],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
});
Text.displayName = "Text";

// =============================================================================
// BUTTON PRIMITIVES
// =============================================================================

export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    isLoading?: boolean;
    asChild?: boolean;
  }
>(({ className, variant = 'primary', size = 'md', isLoading, asChild = false, children, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  
  const baseClasses = 'inline-flex items-center justify-center font-display font-bold uppercase tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-white text-black hover:bg-gray-200 active:bg-gray-300',
    secondary: 'bg-transparent text-white border border-white hover:bg-white/10 active:bg-white/20',
    ghost: 'bg-transparent text-white hover:bg-white/10 active:bg-white/20',
    destructive: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-2 text-xs rounded-full',
    md: 'px-6 py-3 text-sm rounded-full',
    lg: 'px-8 py-4 text-base rounded-full',
    xl: 'px-10 py-5 text-lg rounded-full'
  };

  return (
    <Comp
      ref={ref}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        isLoading && 'cursor-wait',
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-70" />
        </div>
      )}
      <span className={cn(isLoading && 'opacity-0')}>
        {children}
      </span>
    </Comp>
  );
});
Button.displayName = "Button";

// =============================================================================
// CARD PRIMITIVES
// =============================================================================

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'interactive' | 'highlight';
    padding?: 'sm' | 'md' | 'lg' | 'xl';
    glow?: boolean;
  }
>(({ className, variant = 'default', padding = 'md', glow, children, ...props }, ref) => {
  const baseClasses = 'bg-[#1A1B1F] border border-[#2C2D33] rounded-xl transition-all duration-300';
  
  const variantClasses = {
    default: 'shadow-[0_0_20px_rgba(0,0,0,0.3)]',
    interactive: 'shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_40px_rgba(0,0,0,0.4)] hover:scale-[1.02] cursor-pointer',
    highlight: 'shadow-[0_0_30px_rgba(255,255,255,0.1)] border-white/30'
  };
  
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10'
  };

  return (
    <div
      ref={ref}
      className={cn(
        baseClasses,
        variantClasses[variant],
        paddingClasses[padding],
        glow && 'shadow-[0_0_30px_rgba(255,255,255,0.1)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
Card.displayName = "Card";

// =============================================================================
// BADGE PRIMITIVES
// =============================================================================

export const Badge = React.forwardRef<
  HTMLSpanElement,
  React.HTMLAttributes<HTMLSpanElement> & {
    variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'outline';
    size?: 'sm' | 'md' | 'lg';
  }
>(({ className, variant = 'default', size = 'md', children, ...props }, ref) => {
  const baseClasses = 'inline-flex items-center font-display font-bold uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2';
  
  const variantClasses = {
    default: 'bg-white text-black',
    secondary: 'bg-white/20 text-white',
    success: 'bg-green-500/20 text-green-400 border border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30', 
    error: 'bg-red-500/20 text-red-400 border border-red-500/30',
    outline: 'bg-transparent text-white border border-white/30'
  };
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs rounded-full',
    md: 'px-3 py-1 text-xs rounded-full',
    lg: 'px-4 py-2 text-sm rounded-full'
  };

  return (
    <span
      ref={ref}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});
Badge.displayName = "Badge";

// =============================================================================
// INPUT PRIMITIVES
// =============================================================================

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & {
    hasError?: boolean;
  }
>(({ className, hasError, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        styleUtils.getFormFieldClasses(hasError),
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement> & {
    required?: boolean;
  }
>(({ className, required, children, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn(
        'block text-sm font-medium text-white mb-2',
        className
      )}
      {...props}
    >
      {children}
      {required && <span className="text-red-400 ml-1">*</span>}
    </label>
  );
});
Label.displayName = "Label";

// =============================================================================
// STATUS PRIMITIVES
// =============================================================================

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
        'border-2 border-white/30 border-t-white rounded-full animate-spin',
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
});
LoadingSpinner.displayName = "LoadingSpinner";

export const EmptyState = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: React.ReactNode;
  }
>(({ className, icon, title, description, action, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'flex flex-col items-center justify-center text-center p-8 space-y-4',
        className
      )}
      {...props}
    >
      {icon && (
        <div className="text-white/30 mb-4">
          {icon}
        </div>
      )}
      <Heading as="h3" size="md" className="text-white/80">
        {title}
      </Heading>
      {description && (
        <Text variant="secondary" className="max-w-md">
          {description}
        </Text>
      )}
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
});
EmptyState.displayName = "EmptyState";
