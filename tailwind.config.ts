/* eslint-disable @typescript-eslint/no-require-imports */
import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/sections/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        custom:
          '0px 4px 6px -2px rgba(16, 24, 40, 0.25), 0px 12px 16px -4px rgba(16, 24, 40, 0.25)',
      },
      fontFamily: {
        primary: ['var(--font-manrope)'],
        manrope: ['Manrope', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        brand: 'hsl(var(--brand))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'slide-loop': {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
        bell: {
          '0%, 100%': { transform: 'rotate(0deg)' },
          '10%': { transform: 'rotate(-15deg)' },
          '20%': { transform: 'rotate(10deg)' },
          '30%': { transform: 'rotate(-10deg)' },
          '40%': { transform: 'rotate(7deg)' },
          '50%': { transform: 'rotate(-5deg)' },
          '60%': { transform: 'rotate(3deg)' },
          '70%': { transform: 'rotate(-2deg)' },
          '80%': { transform: 'rotate(1deg)' },
        },
        'highlight-animation': {
          '0%': {
            boxShadow: '0 0 0 2px rgba(255, 143, 0, 0.8)',
            borderColor: 'rgba(255, 143, 0, 0.8)',
          },
          '70%': {
            boxShadow: '0 0 0 2px rgba(255, 143, 0, 0.4)',
            borderColor: 'rgba(255, 143, 0, 0.4)',
          },
          '100%': {
            boxShadow: 'none',
            borderColor: 'transparent',
          },
        },
      },
      animation: {
        highlight: 'highlight-animation 2s ease',
        'highlight-message': 'highlight-animation 2s ease',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'slide-loop': 'slide-loop 15s linear infinite',
        bell: 'bell 1s ease-in-out infinite',
      },
      transitionDuration: {
        '20s': '20000ms',
        '25s': '25000ms',
        '30s': '30000ms',
        '35s': '35000ms',
        '40s': '40000ms',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('tailwind-scrollbar'),
    require('@tailwindcss/typography'),
  ],
}
export default config
