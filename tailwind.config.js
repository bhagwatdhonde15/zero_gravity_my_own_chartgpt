/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        theme: {
          bg: '#09090B',
          sidebar: '#111827',
          sidebarDeep: '#0B1220',
          chat: '#0F172A',
          card: '#111827',
          surface: '#1E293B',
          primary: '#3B82F6',
          primaryHover: '#2563EB',
          sky: '#60A5FA',
          cyan: '#06B6D4',
          purple: '#7C3AED',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#EF4444',
          danger: '#DC2626',
          white: '#F8FAFC',
          secondary: '#CBD5E1',
          muted: '#94A3B8',
          borderDark: '#1E293B',
          borderMedium: '#334155',
          borderDivider: '#1F2937',
        }
      },
      boxShadow: {
        'card-premium': '0 20px 40px rgba(0, 0, 0, 0.4)',
        'card-subtle': '0 10px 40px rgba(0, 0, 0, 0.35)',
        'btn-primary': '0 10px 30px rgba(59, 130, 246, 0.35)',
        'btn-hover': '0 10px 25px rgba(37, 99, 235, 0.25)',
        'voice-btn': '0 0 30px rgba(59, 130, 246, 0.4)',
        'floating-glow': '0 0 40px rgba(59, 130, 246, 0.3)',
        'accent-glow': '0 0 40px rgba(59, 130, 246, 0.35)',
        'input-glow': '0 0 25px rgba(59, 130, 246, 0.25)',
      },
      borderRadius: {
        'card': '20px',
        'button': '14px',
        'input': '18px',
        'sidebar': '24px',
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #2563EB, #06B6D4)',
        'gradient-ai': 'linear-gradient(135deg, #7C3AED, #2563EB)',
        'gradient-success': 'linear-gradient(135deg, #10B981, #22C55E)',
        'gradient-purple': 'linear-gradient(135deg, #9333EA, #3B82F6)',
        'gradient-voice': 'linear-gradient(135deg, #3B82F6, #06B6D4)',
        'accent-glow': 'linear-gradient(135deg, #3B82F6, #06B6D4)',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Fira Code', 'Consolas', 'Monaco', 'monospace']
      },
      transitionTimingFunction: {
        'premium': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
      animation: {
        'pulse-subtle': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 8s linear infinite',
        'orb-pulse': 'orb-pulse 3s infinite ease-in-out',
      },
      keyframes: {
        'orb-pulse': {
          '0%': { transform: 'scale(1)', boxShadow: '0 0 25px rgba(56, 189, 248, 0.3)' },
          '50%': { transform: 'scale(1.08)', boxShadow: '0 0 50px rgba(59, 130, 246, 0.7)' },
          '100%': { transform: 'scale(1)', boxShadow: '0 0 25px rgba(56, 189, 248, 0.3)' }
        }
      }
    },
  },
  plugins: [],
}
