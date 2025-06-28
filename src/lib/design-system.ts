
// BLACKLABEL.gg Comprehensive Design System
// Consolidated design tokens and utility functions

export const designSystem = {
  // Core Color Palette - Monochromatic Luxury
  colors: {
    // Primary backgrounds
    background: {
      primary: '#0B0C10',    // Near-black luxe
      secondary: '#1A1B1F',  // Dark neutral surface
      tertiary: '#16171A',   // Card backgrounds
      overlay: 'rgba(0, 0, 0, 0.8)',
    },
    
    // Text hierarchy
    text: {
      primary: '#FFFFFF',     // Pure white headlines
      secondary: '#B4B4B4',   // Light gray body text
      tertiary: '#777777',    // Muted text
      disabled: '#525252',    // Disabled states
    },
    
    // Interactive elements
    interactive: {
      primary: '#FFFFFF',     // White CTA buttons
      primaryText: '#000000', // Black text on white
      secondary: 'transparent', // Transparent secondary buttons
      border: '#FFFFFF',      // White borders
      hover: 'rgba(255, 255, 255, 0.1)',
      focus: 'rgba(255, 255, 255, 0.3)',
      active: 'rgba(255, 255, 255, 0.2)',
    },
    
    // Status colors
    status: {
      success: '#4ADE80',
      warning: '#FACC15',
      error: '#F87171',
      info: '#FFFFFF',
    },
    
    // UI borders and dividers
    border: {
      default: '#2C2D33',
      light: '#404040',
      dark: '#1A1B1F',
    }
  },

  // Typography Scale
  typography: {
    fontFamily: {
      display: ['Orbitron', 'Rajdhani', 'sans-serif'],
      body: ['Satoshi', 'Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
    },
    
    scale: {
      xs: '0.75rem',     // 12px
      sm: '0.875rem',    // 14px
      base: '1rem',      // 16px
      lg: '1.125rem',    // 18px
      xl: '1.25rem',     // 20px
      '2xl': '1.5rem',   // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
    },
    
    weight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
    
    letterSpacing: {
      tight: '-0.025em',
      normal: '0em',
      wide: '0.04em',
    }
  },

  // Spacing Scale
  spacing: {
    xs: '0.5rem',    // 8px
    sm: '1rem',      // 16px
    md: '1.5rem',    // 24px
    lg: '2rem',      // 32px
    xl: '3rem',      // 48px
    '2xl': '4rem',   // 64px
    '3xl': '6rem',   // 96px
    
    // Layout specific
    section: '6rem',      // Between major sections
    container: '2rem',    // Container padding
    card: '1.5rem',       // Card internal padding
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1.25rem',   // 20px
    full: '9999px',
  },

  // Shadows
  shadows: {
    card: '0 0 20px rgba(0, 0, 0, 0.3)',
    hover: '0 0 40px rgba(0, 0, 0, 0.4)',
    focus: '0 0 0 2px rgba(255, 255, 255, 0.3)',
    glow: '0 0 30px rgba(255, 255, 255, 0.1)',
    'glow-lg': '0 0 60px rgba(255, 255, 255, 0.2)',
  },

  // Layout
  layout: {
    maxWidth: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      container: '1200px',
    },
    
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    }
  },

  // Animation
  animation: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    
    easing: {
      linear: 'linear',
      ease: 'ease',
      'ease-in': 'ease-in',
      'ease-out': 'ease-out',
      'ease-in-out': 'ease-in-out',
    }
  }
} as const;

// Utility functions for consistent styling
export const styleUtils = {
  // Get consistent button classes
  getButtonClasses: (variant: 'primary' | 'secondary' | 'ghost' = 'primary', size: 'sm' | 'md' | 'lg' = 'md') => {
    const baseClasses = 'inline-flex items-center justify-center font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-white text-black hover:bg-gray-200',
      secondary: 'bg-transparent text-white border border-white hover:bg-white/10',
      ghost: 'bg-transparent text-white hover:bg-white/10',
    };
    
    const sizes = {
      sm: 'px-4 py-2 text-sm rounded-full',
      md: 'px-6 py-3 text-base rounded-full',
      lg: 'px-8 py-4 text-lg rounded-full',
    };
    
    return `${baseClasses} ${variants[variant]} ${sizes[size]}`;
  },

  // Get consistent card classes
  getCardClasses: (variant: 'default' | 'interactive' | 'highlight' = 'default') => {
    const baseClasses = 'bg-[#1A1B1F] border border-[#2C2D33] rounded-xl transition-all duration-300';
    
    const variants = {
      default: 'shadow-[0_0_20px_rgba(0,0,0,0.3)]',
      interactive: 'shadow-[0_0_20px_rgba(0,0,0,0.3)] hover:shadow-[0_0_40px_rgba(0,0,0,0.4)] hover:scale-[1.02] cursor-pointer',
      highlight: 'shadow-[0_0_30px_rgba(255,255,255,0.1)] border-white/30',
    };
    
    return `${baseClasses} ${variants[variant]}`;
  },

  // Get consistent text classes
  getTextClasses: (variant: 'heading' | 'body' | 'caption' | 'label' = 'body', weight: 'normal' | 'medium' | 'semibold' | 'bold' = 'normal') => {
    const baseClasses = 'text-white';
    
    const variants = {
      heading: 'font-display uppercase tracking-wide',
      body: 'font-body leading-relaxed',
      caption: 'font-body text-sm text-white/70',
      label: 'font-body text-sm font-medium',
    };
    
    const weights = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    };
    
    return `${baseClasses} ${variants[variant]} ${weights[weight]}`;
  },

  // Get consistent form field classes
  getFormFieldClasses: (hasError: boolean = false) => {
    const baseClasses = 'w-full rounded-md border bg-black/20 px-3 py-2 text-white placeholder:text-white/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-background';
    const errorClasses = hasError ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-white';
    
    return `${baseClasses} ${errorClasses}`;
  },

  // Get consistent spacing classes
  getSpacingClasses: (direction: 'all' | 'x' | 'y' | 't' | 'b' | 'l' | 'r', size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl') => {
    const sizeMap = {
      xs: '2',
      sm: '4', 
      md: '6',
      lg: '8',
      xl: '12',
      '2xl': '16',
      '3xl': '24'
    };
    
    const directionMap = {
      all: 'p',
      x: 'px',
      y: 'py', 
      t: 'pt',
      b: 'pb',
      l: 'pl',
      r: 'pr'
    };
    
    return `${directionMap[direction]}-${sizeMap[size]}`;
  }
};

export type DesignSystem = typeof designSystem;
export type StyleUtils = typeof styleUtils;
