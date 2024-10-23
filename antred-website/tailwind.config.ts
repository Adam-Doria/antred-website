import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}'
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        gradient: 'var(--brand-gradient-600-700)',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        gray: {
          '25': 'var(--gray-25)',
          '50': 'var(--gray-50)',
          '100': 'var(--gray-100)',
          '200': 'var(--gray-200)',
          '300': 'var(--gray-300)',
          '400': 'var(--gray-400)',
          '500': 'var(--gray-500)',
          '600': 'var(--gray-600)',
          '700': 'var(--gray-700)',
          '800': 'var(--gray-800)',
          '900': 'var(--gray-900)'
        },
        brand: {
          '25': 'var(--brand-25)',
          '50': 'var(--brand-50)',
          '100': 'var(--brand-100)',
          '200': 'var(--brand-200)',
          '300': 'var(--brand-300)',
          '400': 'var(--brand-400)',
          '500': 'var(--brand-500)',
          '600': 'var(--brand-600)',
          '700': 'var(--brand-700)',
          '800': 'var(--brand-800)',
          '900': 'var(--brand-900)'
        },
        error: {
          '25': 'var(--error-25)',
          '50': 'var(--error-50)',
          '100': 'var(--error-100)',
          '200': 'var(--error-200)',
          '300': 'var(--error-300)',
          '400': 'var(--error-400)',
          '500': 'var(--error-500)',
          '600': 'var(--error-600)',
          '700': 'var(--error-700)',
          '800': 'var(--error-800)',
          '900': 'var(--error-900)'
        },
        warning: {
          '25': 'var(--warning-25)',
          '50': 'var(--warning-50)',
          '100': 'var(--warning-100)',
          '200': 'var(--warning-200)',
          '300': 'var(--warning-300)',
          '400': 'var(--warning-400)',
          '500': 'var(--warning-500)',
          '600': 'var(--warning-600)',
          '700': 'var(--warning-700)',
          '800': 'var(--warning-800)',
          '900': 'var(--warning-900)'
        },
        success: {
          '25': 'var(--success-25)',
          '50': 'var(--success-50)',
          '100': 'var(--success-100)',
          '200': 'var(--success-200)',
          '300': 'var(--success-300)',
          '400': 'var(--success-400)',
          '500': 'var(--success-500)',
          '600': 'var(--success-600)',
          '700': 'var(--success-700)',
          '800': 'var(--success-800)',
          '900': 'var(--success-900)'
        },
        'red-ribbon': {
          '25': 'var(--red-ribbon-25)',
          '50': 'var(--red-ribbon-50)',
          '100': 'var(--red-ribbon-100)',
          '200': 'var(--red-ribbon-200)',
          '300': 'var(--red-ribbon-300)',
          '400': 'var(--red-ribbon-400)',
          '500': 'var(--red-ribbon-500)',
          '600': 'var(--red-ribbon-600)',
          '700': 'var(--red-ribbon-700)',
          '800': 'var(--red-ribbon-800)',
          '900': 'var(--red-ribbon-900)'
        },
        aztec: {
          '50': 'var(--aztec-50)',
          '100': 'var(--aztec-100)',
          '200': 'var(--aztec-200)',
          '300': 'var(--aztec-300)',
          '400': 'var(--aztec-400)',
          '500': 'var(--aztec-500)',
          '600': 'var(--aztec-600)',
          '700': 'var(--aztec-700)',
          '800': 'var(--aztec-800)',
          '900': 'var(--aztec-900)',
          '950': 'var(--aztec-950)'
        },
        bridesmaid: {
          '25': 'var(--bridesmaid-25)',
          '50': 'var(--bridesmaid-50)',
          '100': 'var(--bridesmaid-100)',
          '200': 'var(--bridesmaid-200)',
          '300': 'var(--bridesmaid-300)',
          '400': 'var(--bridesmaid-400)',
          '500': 'var(--bridesmaid-500)',
          '600': 'var(--bridesmaid-600)',
          '700': 'var(--bridesmaid-700)',
          '800': 'var(--bridesmaid-800)',
          '900': 'var(--bridesmaid-900)'
        }
      },
      gradientColorStops: {
        'gray-gradient-600-500': 'var(--gray-gradient-600-500)',
        'gray-gradient-600-700': 'var(--gray-gradient-600-700)',
        'gray-gradient-700-800': 'var(--gray-gradient-700-800)',
        'gray-gradient-800-900': 'var(--gray-gradient-800-900)',
        'gray-gradient-800-700': 'var(--gray-gradient-800-700)',
        'gray-gradient-900-600': 'var(--gray-gradient-900-600)',
        'brand-gradient-600-500': 'var(--brand-gradient-600-500)',
        'brand-gradient-600-700': 'var(--brand-gradient-600-700)',
        'brand-gradient-700-800': 'var(--brand-gradient-700-800)',
        'brand-gradient-800-600': 'var(--brand-gradient-800-600)',
        'brand-gradient-800-900': 'var(--brand-gradient-800-900)',
        'brand-gradient-900-800': 'var(--brand-gradient-900-800)'
      },
      borderRadius: {
        xl: 'calc(var(--radius) + 20px)',
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      backgroundImage: {
        'brand-radial':
          'radial-gradient(circle, var(--brand-700) 10%, var(--brand-800) 90%)'
      },
      fontSize: {
        xxs: ['0.5rem', { lineHeight: '1rem' }],
        xs: ['0.75rem', { lineHeight: '1.125rem' }],
        sm: ['1rem', { lineHeight: '1.5rem' }],
        md: ['1.125rem', { lineHeight: '1.75rem' }],
        lg: ['1.25rem', { lineHeight: '1.75rem' }],
        xl: ['1.5rem', { lineHeight: '2rem' }]
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        marquee: {
          from: {
            transform: 'translateX(0)'
          },
          to: {
            transform: 'translateX(calc(-100% - var(--gap)))'
          }
        },
        'marquee-vertical': {
          from: {
            transform: 'translateY(0)'
          },
          to: {
            transform: 'translateY(calc(-100% - var(--gap)))'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        marquee: 'marquee var(--duration) infinite linear',
        'marquee-vertical': 'marquee-vertical var(--duration) linear infinite'
      }
    }
  },
  plugins: [require('tailwindcss-animate')]
} satisfies Config

export default config
