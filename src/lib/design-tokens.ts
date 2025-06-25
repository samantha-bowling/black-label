
// BlackLabel.gg Monochromatic Design System
// Premium black, white, and gray color palette for maximum professionalism

export const designTokens = {
  // Color Palette - Monochromatic
  colors: {
    // Primary - White accent on dark backgrounds
    primary: {
      DEFAULT: '#FFFFFF',
      muted: '#D4D4D8',     // Zinc-300
      foreground: '#000000',
    },
    
    // Backgrounds - Dark luxury
    background: {
      primary: '#0B0C10',    // Near-black luxe
      secondary: '#1A1B1F',  // Dark neutral surface
      tertiary: '#16171A',   // Slightly darker variant
    },

    // Text colors
    text: {
      primary: '#FFFFFF',    // Pure white
      secondary: '#B4B4B4',  // Light gray
      tertiary: '#777777',   // Medium gray
      muted: '#525252',      // Dark gray
    },

    // Neutral grays
    neutral: {
      50: '#FAFAFA',
      100: '#F5F5F5', 
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },

    // Semantic colors (keep colored for clarity)
    semantic: {
      success: '#4ADE80',
      warning: '#FACC15', 
      error: '#F87171',
      info: '#FFFFFF',
    },

    // UI elements
    border: {
      DEFAULT: '#2C2D33',
      light: '#404040',
      dark: '#1A1B1F',
    },

    // Interactive states
    interactive: {
      hover: 'rgba(255, 255, 255, 0.1)',
      focus: 'rgba(255, 255, 255, 0.3)',
      active: 'rgba(255, 255, 255, 0.2)',
    }
  },

  // Typography
  typography: {
    fontFamily: {
      display: "'Orbitron', 'Rajdhani', sans-serif",
      body: "'Satoshi', 'Inter', sans-serif",
      sans: ['Satoshi', 'Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
    },
    heading: {
      fontFamily: "var(--font-display)",
      fontWeight: 700,
      letterSpacing: '0.03em',
      textTransform: 'uppercase',
    },
    body: {
      fontFamily: "var(--font-body)",
      fontWeight: 400,
      lineHeight: 1.65,
    },
    fontSize: {
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
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    letterSpacing: {
      tight: '-0.025em',
      normal: '0em',
      wide: '0.04em',
    },
  },

  // Spacing
  spacing: {
    xs: '0.5rem',    // 8px
    sm: '1rem',      // 16px
    md: '1.5rem',    // 24px
    lg: '2rem',      // 32px
    xl: '3rem',      // 48px
    '2xl': '4rem',   // 64px
    '3xl': '6rem',   // 96px
  },

  // Border radius
  borderRadius: {
    none: '0',
    sm: '0.25rem',   // 4px
    md: '0.5rem',    // 8px
    lg: '0.75rem',   // 12px
    xl: '1.25rem',   // 20px
    full: '9999px',
  },

  // Shadows - Monochromatic
  shadows: {
    card: '0 0 20px rgba(0, 0, 0, 0.3)',
    hover: '0 0 40px rgba(0, 0, 0, 0.4)',
    focus: '0 0 0 2px rgba(255, 255, 255, 0.3)',
    glow: '0 0 30px rgba(255, 255, 255, 0.1)',
    'glow-lg': '0 0 60px rgba(255, 255, 255, 0.2)',
  },

  // Component definitions
  components: {
    button: {
      primary: {
        background: '#FFFFFF',
        color: '#000000',
        hover: '#E5E5E5',
        padding: '0.75rem 1.5rem',
        borderRadius: 'full',
        fontWeight: 700,
        fontFamily: "var(--font-display)",
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
      },
      secondary: {
        background: 'transparent',
        color: '#FFFFFF',
        border: '1px solid #FFFFFF',
        hover: 'rgba(255, 255, 255, 0.1)',
        padding: '0.75rem 1.5rem',
        borderRadius: 'full',
        fontWeight: 700,
        fontFamily: "var(--font-display)",
        letterSpacing: '0.03em',
        textTransform: 'uppercase',
      },
    },
    
    card: {
      background: '#1A1B1F',
      border: '1px solid #2C2D33',
      borderRadius: '1.25rem',
      padding: '2rem',
      shadow: '0 0 20px rgba(0, 0, 0, 0.3)',
      hover: {
        shadow: '0 0 40px rgba(0, 0, 0, 0.4)',
      },
    },

    input: {
      background: '#1F2024',
      border: '1px solid #2C2D33',
      borderRadius: '0.5rem',
      padding: '0.75rem',
      fontFamily: "var(--font-body)",
      focus: {
        border: '1px solid #FFFFFF',
        shadow: '0 0 0 2px rgba(255, 255, 255, 0.3)',
      },
    },

    badge: {
      background: '#FFFFFF',
      color: '#000000',
      borderRadius: 'full',
      padding: '0.25rem 0.75rem',
      fontSize: '0.75rem',
      fontWeight: 700,
      fontFamily: "var(--font-display)",
      letterSpacing: '0.03em',
      textTransform: 'uppercase',
    },
  },

  // Animation durations
  animation: {
    fast: '0.15s',
    normal: '0.3s',
    slow: '0.5s',
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

export type DesignTokens = typeof designTokens;
