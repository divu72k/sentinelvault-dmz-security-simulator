/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: ['Inter', 'sans-serif'],
  			mono: ['JetBrains Mono', 'monospace']
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))'
  		},
  		keyframes: {
  			'scan-line': {
  				'0%': { transform: 'translateY(-100%)' },
  				'100%': { transform: 'translateY(1000%)' }
  			},
  			'pulse-slow': {
  				'0%, 100%': { opacity: 0.3 },
  				'50%': { opacity: 0.6 }
  			}
  		},
  		animation: {
  			'scan': 'scan-line 8s linear infinite',
  			'pulse-slow': 'pulse-slow 4s ease-in-out infinite'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")]
}