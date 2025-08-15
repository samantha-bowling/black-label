import * as React from "react";
import { cn } from "@/lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

// =============================================================================
// TOKENS & VARIANTS
// =============================================================================

// Button Variants
const buttonVariants = cva(
  "inline-flex items-center justify-center font-display font-bold uppercase tracking-wide transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-white text-black hover:bg-gray-200 active:bg-gray-300",
        secondary: "bg-transparent text-white border border-white hover:bg-white/10 active:bg-white/20",
        ghost: "bg-transparent text-white hover:bg-white/10 active:bg-white/20",
        destructive: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800",
        premium: "bg-gradient-to-r from-white to-gray-100 text-black hover:from-gray-100 hover:to-gray-200 shadow-glow",
        gaming: "bg-surface border border-white/20 text-white hover:bg-white/5 hover:border-white/40 hover:shadow-glow"
      },
      size: {
        sm: "px-4 py-2 text-xs rounded-full",
        md: "px-6 py-3 text-sm rounded-full",
        lg: "px-8 py-4 text-base rounded-full",
        xl: "px-10 py-5 text-lg rounded-full"
      }
    },
    defaultVariants: {
      variant: "primary",
      size: "md"
    }
  }
);

// Card Variants
const cardVariants = cva(
  "bg-surface border border-border rounded-xl transition-all duration-300",
  {
    variants: {
      variant: {
        default: "shadow-card",
        interactive: "shadow-card hover:shadow-hover hover:scale-[1.02] cursor-pointer",
        highlight: "shadow-glow border-white/30",
        gaming: "bg-gradient-to-br from-surface to-surface/90 border-white/20 shadow-glow"
      },
      padding: {
        none: "p-0",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
        xl: "p-10"
      },
      elevation: {
        1: "shadow-sm",
        2: "shadow-card",
        3: "shadow-hover",
        4: "shadow-glow",
        5: "shadow-glow-lg"
      }
    },
    defaultVariants: {
      variant: "default",
      padding: "md",
      elevation: 2
    }
  }
);

// Typography Variants
const headingVariants = cva(
  "font-display font-bold uppercase tracking-wide leading-tight",
  {
    variants: {
      size: {
        xs: "text-lg",
        sm: "text-xl",
        md: "text-2xl",
        lg: "text-3xl lg:text-4xl",
        xl: "text-4xl lg:text-5xl",
        "2xl": "text-5xl lg:text-6xl",
        "3xl": "text-6xl lg:text-7xl",
        "4xl": "text-7xl lg:text-8xl"
      },
      variant: {
        default: "text-white",
        gradient: "bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent",
        muted: "text-white/80"
      },
      effect: {
        none: "",
        glow: "drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]",
        pulse: "animate-pulse-glow"
      }
    },
    defaultVariants: {
      size: "lg",
      variant: "default",
      effect: "none"
    }
  }
);

const textVariants = cva(
  "font-body leading-relaxed",
  {
    variants: {
      size: {
        xs: "text-xs",
        sm: "text-sm",
        base: "text-base",
        lg: "text-lg",
        xl: "text-xl"
      },
      variant: {
        primary: "text-white",
        secondary: "text-white/80",
        tertiary: "text-white/60",
        disabled: "text-white/40",
        success: "text-success",
        warning: "text-warning",
        destructive: "text-destructive"
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold"
      }
    },
    defaultVariants: {
      size: "base",
      variant: "primary",
      weight: "normal"
    }
  }
);

// Badge Variants
const badgeVariants = cva(
  "inline-flex items-center font-display font-bold uppercase tracking-wide transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-white text-black",
        secondary: "bg-white/20 text-white",
        success: "bg-success/20 text-success border border-success/30",
        warning: "bg-warning/20 text-warning border border-warning/30",
        destructive: "bg-destructive/20 text-destructive border border-destructive/30",
        outline: "bg-transparent text-white border border-white/30",
        gaming: "bg-gradient-to-r from-white/10 to-white/5 text-white border border-white/20 shadow-glow"
      },
      size: {
        sm: "px-2 py-1 text-xs rounded-full",
        md: "px-3 py-1 text-xs rounded-full",
        lg: "px-4 py-2 text-sm rounded-full"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md"
    }
  }
);

// Input Variants
const inputVariants = cva(
  "w-full border border-border bg-input px-3 py-2 text-white placeholder:text-white/50 font-body transition-all duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "rounded-md focus:border-white",
        gaming: "rounded-lg bg-surface/50 border-white/20 focus:border-white/60 focus:shadow-glow"
      },
      size: {
        sm: "px-2 py-1 text-sm",
        md: "px-3 py-2 text-base",
        lg: "px-4 py-3 text-lg"
      },
      state: {
        default: "",
        error: "border-destructive focus:border-destructive",
        success: "border-success focus:border-success"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      state: "default"
    }
  }
);

// =============================================================================
// ATOMIC COMPONENTS
// =============================================================================

// Button Component
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading, children, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isLoading}
        {...props}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-70" />
          </div>
        )}
        <span className={cn(isLoading && "opacity-0")}>
          {children}
        </span>
      </Comp>
    );
  }
);
Button.displayName = "Button";

// Card Component
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  glow?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, padding, elevation, glow, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, padding, elevation }),
          glow && "shadow-glow",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

// Heading Component
export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, as: Component = "h2", size, variant, effect, children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(headingVariants({ size, variant, effect }), className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Heading.displayName = "Heading";

// Text Component
export interface TextProps
  extends React.HTMLAttributes<HTMLElement> {
  as?: "p" | "span" | "div" | "label";
  size?: "xs" | "sm" | "base" | "lg" | "xl";
  variant?: "primary" | "secondary" | "tertiary" | "disabled" | "success" | "warning" | "destructive";
  weight?: "normal" | "medium" | "semibold" | "bold";
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
  ({ className, as: Component = "p", size, variant, weight, children, ...props }, ref) => {
    return (
      <Component
        ref={ref as any}
        className={cn(textVariants({ size, variant, weight }), className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Text.displayName = "Text";

// Badge Component
export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Badge.displayName = "Badge";

// Input Component
export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  hasError?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant, size, state, hasError, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          inputVariants({ 
            variant, 
            size, 
            state: hasError ? "error" : state 
          }),
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// Label Component
export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, required, children, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn("block text-sm font-medium text-white mb-2", className)}
        {...props}
      >
        {children}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
    );
  }
);
Label.displayName = "Label";

// =============================================================================
// LAYOUT COMPONENTS
// =============================================================================

// Container Component
export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = "xl", children, ...props }, ref) => {
    const sizeClasses = {
      sm: "max-w-2xl",
      md: "max-w-4xl",
      lg: "max-w-6xl",
      xl: "max-w-7xl",
      full: "max-w-full"
    };

    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto px-4 sm:px-6 lg:px-8",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Container.displayName = "Container";

// Section Component
export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: "sm" | "md" | "lg" | "xl";
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing = "lg", children, ...props }, ref) => {
    const spacingClasses = {
      sm: "py-8",
      md: "py-12",
      lg: "py-16",
      xl: "py-24"
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
  }
);
Section.displayName = "Section";

// =============================================================================
// STATUS COMPONENTS
// =============================================================================

// Loading Spinner
export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg";
}

export const LoadingSpinner = React.forwardRef<HTMLDivElement, LoadingSpinnerProps>(
  ({ className, size = "md", ...props }, ref) => {
    const sizeClasses = {
      sm: "w-4 h-4",
      md: "w-6 h-6",
      lg: "w-8 h-8"
    };

    return (
      <div
        ref={ref}
        className={cn(
          "border-2 border-white/30 border-t-white rounded-full animate-spin",
          sizeClasses[size],
          className
        )}
        {...props}
      />
    );
  }
);
LoadingSpinner.displayName = "LoadingSpinner";

// Empty State
export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center text-center p-8 space-y-4",
          className
        )}
        {...props}
      >
        {icon && (
          <div className="text-white/30 mb-4">
            {icon}
          </div>
        )}
        <Heading as="h3" size="md" variant="muted">
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
  }
);
EmptyState.displayName = "EmptyState";

// Progress Component
export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showPercentage?: boolean;
  variant?: "default" | "gaming";
}

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ className, value, max = 100, showPercentage, variant = "default", ...props }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    
    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {showPercentage && (
          <div className="flex justify-between text-sm">
            <Text variant="secondary">Progress</Text>
            <Text variant="secondary">{Math.round(percentage)}%</Text>
          </div>
        )}
        <div 
          className={cn(
            "h-2 w-full rounded-full overflow-hidden",
            variant === "gaming" ? "bg-surface border border-white/20" : "bg-muted"
          )}
        >
          <div
            className={cn(
              "h-full transition-all duration-500 ease-out",
              variant === "gaming" 
                ? "bg-gradient-to-r from-white to-gray-300 shadow-glow" 
                : "bg-white"
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);
Progress.displayName = "Progress";