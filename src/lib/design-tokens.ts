
/**
 * BlackLabel.gg Design System Tokens
 * Elite gaming talent platform - prestige & exclusivity
 */

export const designTokens = {
  // Color Palette
  colors: {
    // Primary Brand Colors
    primary: {
      DEFAULT: '#B983FF', // Electric violet
      50: '#F4EDFF',
      100: '#E9DBFF',
      200: '#D3B7FF',
      300: '#BD93FF',
      400: '#B983FF',
      500: '#9C6BE0',
      600: '#8053C7',
      700: '#643BAE',
      800: '#482395',
      900: '#2C0B7C'
    },
    
    // Neutral Scale
    neutral: {
      50: '#FFFFFF',
      100: '#F8F9FA',
      200: '#E9ECEF',
      300: '#DEE2E6',
      400: '#CED4DA',
      500: '#B4B4B4', // Secondary text
      600: '#777777', // Tertiary text
      700: '#495057',
      800: '#343A40',
      900: '#212529',
      950: '#0B0C10' // Background
    },
    
    // Dark Theme Surfaces
    surface: {
      DEFAULT: '#1A1B1F',
      light: '#2C2D33',
      lighter: '#3A3B41',
      input: '#1F2024'
    },
    
    // Semantic Colors
    semantic: {
      success: '#4ADE80',
      warning: '#FACC15', 
      error: '#F87171',
      info: '#60A5FA'
    },
    
    // Gaming Accents
    gaming: {
      neon: '#00FFFF',
      gold: '#FFD700',
      red: '#FF4444',
      green: '#44FF44'
    }
  },

  // Typography Scale
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      display: ['Orbitron', 'Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'monospace']
    },
    
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],
      sm: ['0.875rem', { lineHeight: '1.25rem' }],
      base: ['1rem', { lineHeight: '1.5rem' }],
      lg: ['1.125rem', { lineHeight: '1.75rem' }],
      xl: ['1.25rem', { lineHeight: '1.75rem' }],
      '2xl': ['1.5rem', { lineHeight: '2rem' }],
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      '5xl': ['3rem', { lineHeight: '1' }],
      '6xl': ['3.75rem', { lineHeight: '1' }]
    },
    
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      black: '900'
    },
    
    letterSpacing: {
      tight: '-0.025em',
      normal: '0em',
      wide: '0.04em',
      wider: '0.08em'
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
    '4xl': '8rem'    // 128px
  },

  // Border Radius
  borderRadius: {
    none: '0px',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1.25rem',   // 20px
    '2xl': '1.5rem', // 24px
    full: '9999px'
  },

  // Shadows & Elevation
  boxShadow: {
    card: '0 0 20px rgba(185, 131, 255, 0.05)',
    hover: '0 0 40px rgba(185, 131, 255, 0.1)',
    focus: '0 0 0 2px rgba(185, 131, 255, 0.3)',
    glow: '0 0 30px rgba(185, 131, 255, 0.2)',
    'glow-lg': '0 0 60px rgba(185, 131, 255, 0.3)'
  },

  // Component Styles
  components: {
    button: {
      primary: {
        background: 'linear-gradient(135deg, #B983FF, #8C61F0)',
        color: '#FFFFFF',
        fontWeight: '600',
        borderRadius: 'full',
        padding: '0.75rem 1.5rem',
        transition: 'all 0.2s ease'
      },
      secondary: {
        background: 'transparent',
        border: '1px solid #B983FF',
        color: '#B983FF',
        borderRadius: 'full',
        padding: '0.75rem 1.5rem'
      }
    },
    
    card: {
      background: '#1A1B1F',
      borderRadius: '1.25rem',
      padding: '2rem',
      boxShadow: '0 0 20px rgba(185, 131, 255, 0.05)',
      border: '1px solid #2C2D33'
    },
    
    input: {
      background: '#1F2024',
      border: '1px solid #2C2D33',
      borderRadius: '0.5rem',
      padding: '0.75rem 1rem',
      placeholderColor: '#777777',
      focusBorder: '#B983FF'
    },
    
    badge: {
      beta: {
        background: '#B983FF',
        color: '#0B0C10',
        fontWeight: '600',
        borderRadius: 'full',
        padding: '0.25rem 0.75rem',
        fontSize: '0.75rem'
      }
    }
  },

  // Animation Curves
  animation: {
    duration: {
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
      slower: '500ms'
    },
    
    easing: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
      spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },

  // Z-Index Scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800
  }
} as const;

// Type definitions for design tokens
export type DesignTokens = typeof designTokens;
export type ColorScale = keyof typeof designTokens.colors.primary;
export type SpacingScale = keyof typeof designTokens.spacing;
export type FontSize = keyof typeof designTokens.typography.fontSize;

// Utility functions for accessing tokens
export const getColor = (path: string) => {
  const keys = path.split('.');
  let value: any = designTokens.colors;
  
  for (const key of keys) {
    value = value?.[key];
  }
  
  return value || null;
};

export const getSpacing = (scale: SpacingScale) => {
  return designTokens.spacing[scale];
};

export const getFontSize = (scale: FontSize) => {
  return designTokens.typography.fontSize[scale];
};
