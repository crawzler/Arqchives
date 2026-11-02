/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Semantic colors from tokens.css
        border: "hsl(var(--color-border-default))",
        input: "hsl(var(--color-border-default))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--color-bg-base))",
        foreground: "hsl(var(--color-text-primary))",
        primary: {
          DEFAULT: "hsl(var(--color-accent))",
          foreground: "hsl(var(--color-bg-base))",
        },
        secondary: {
          DEFAULT: "hsl(var(--color-bg-elevated))",
          foreground: "hsl(var(--color-text-primary))",
        },
        destructive: {
          DEFAULT: "hsl(var(--color-status-skipped))",
          foreground: "hsl(var(--color-bg-base))",
        },
        muted: {
          DEFAULT: "hsl(var(--color-bg-subtle))",
          foreground: "hsl(var(--color-text-muted))",
        },
        accent: {
          DEFAULT: "hsl(var(--color-accent))",
          foreground: "hsl(var(--color-bg-base))",
        },
        popover: {
          DEFAULT: "hsl(var(--color-bg-overlay))",
          foreground: "hsl(var(--color-text-primary))",
        },
        card: {
          DEFAULT: "hsl(var(--color-bg-elevated))",
          foreground: "hsl(var(--color-text-primary))",
        },
        // Neutral palette (for direct use when needed)
        neutral: {
          50:  "hsl(var(--color-neutral-50))",
          100: "hsl(var(--color-neutral-100))",
          200: "hsl(var(--color-neutral-200))",
          300: "hsl(var(--color-neutral-300))",
          400: "hsl(var(--color-neutral-400))",
          500: "hsl(var(--color-neutral-500))",
          600: "hsl(var(--color-neutral-600))",
          700: "hsl(var(--color-neutral-700))",
          800: "hsl(var(--color-neutral-800))",
          900: "hsl(var(--color-neutral-900))",
          950: "hsl(var(--color-neutral-950))",
        },
        // Status colors
        status: {
          completed: "hsl(var(--color-status-completed))",
          in_progress: "hsl(var(--color-status-in_progress))",
          planned: "hsl(var(--color-status-planned))",
          missing: "hsl(var(--color-status-missing))",
          skipped: "hsl(var(--color-status-skipped))",
        },
        // Type colors
        type: {
          album: "hsl(var(--color-type-album))",
          ep: "hsl(var(--color-type-ep))",
          single: "hsl(var(--color-type-single))",
          compilation: "hsl(var(--color-type-compilation))",
        },
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
        full: "var(--radius-full)",
      },
      spacing: {
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
      },
      fontSize: {
        caption: ["var(--text-caption)", { lineHeight: "var(--leading-normal)" }],
        "body-sm": ["var(--text-body-sm)", { lineHeight: "var(--leading-normal)" }],
        body: ["var(--text-body)", { lineHeight: "var(--leading-normal)" }],
        "body-lg": ["var(--text-body-lg)", { lineHeight: "var(--leading-relaxed)" }],
        "heading-sm": ["var(--text-heading-sm)", { lineHeight: "var(--leading-tight)", fontWeight: "var(--font-semibold)" }],
        heading: ["var(--text-heading)", { lineHeight: "var(--leading-tight)", fontWeight: "var(--font-semibold)" }],
        "heading-lg": ["var(--text-heading-lg)", { lineHeight: "var(--leading-tight)", fontWeight: "var(--font-semibold)" }],
        display: ["var(--text-display)", { lineHeight: "var(--leading-tight)", fontWeight: "var(--font-bold)" }],
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      fontWeight: {
        normal: "var(--font-normal)",
        medium: "var(--font-medium)",
        semibold: "var(--font-semibold)",
        bold: "var(--font-bold)",
      },
      lineHeight: {
        tight: "var(--leading-tight)",
        normal: "var(--leading-normal)",
        relaxed: "var(--leading-relaxed)",
      },
      boxShadow: {
        elev1: "var(--elevation-1)",
        elev2: "var(--elevation-2)",
        elev3: "var(--elevation-3)",
        elev4: "var(--elevation-4)",
        elev5: "var(--elevation-5)",
      },
      transitionDuration: {
        instant: "var(--duration-instant)",
        fast: "var(--duration-fast)",
        normal: "var(--duration-normal)",
        slow: "var(--duration-slow)",
        slower: "var(--duration-slower)",
      },
      transitionTimingFunction: {
        linear: "var(--ease-linear)",
        in: "var(--ease-in)",
        out: "var(--ease-out)",
        "in-out": "var(--ease-in-out)",
        spring: "var(--ease-spring)",
        bounce: "var(--ease-bounce)",
        "expo-out": "var(--ease-expo-out)",
        "expo-in-out": "var(--ease-expo-in-out)",
      },
      zIndex: {
        base: "var(--z-base)",
        dropdown: "var(--z-dropdown)",
        sticky: "var(--z-sticky)",
        modal: "var(--z-modal)",
        popover: "var(--z-popover)",
        tooltip: "var(--z-tooltip)",
        toast: "var(--z-toast)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}