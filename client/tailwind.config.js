/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Support dark mode toggle
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: 'var(--cyber-bg-color)',
          card: 'var(--cyber-card-color)',
          border: 'var(--cyber-border-color)',
          primary: 'var(--cyber-primary-color)',
          secondary: 'var(--cyber-secondary-color)',
          accent: 'var(--cyber-accent-color)',
          glow: '#39ff14',       // Matrix Green
          text: 'var(--cyber-text-color)',
          textMuted: 'var(--cyber-text-muted)'
        }
      },
      fontFamily: {
        orbitron: ['Orbitron', 'sans-serif'],
        inter: ['Inter', 'sans-serif']
      },
      boxShadow: {
        'neon-teal': '0 0 15px rgba(0, 242, 254, 0.35)',
        'neon-purple': '0 0 15px rgba(155, 93, 229, 0.35)',
        'neon-green': '0 0 15px rgba(57, 255, 20, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      backgroundImage: {
        'cyber-gradient': 'linear-gradient(135deg, var(--cyber-primary-color) 0%, var(--cyber-secondary-color) 100%)',
        'dark-radial': 'radial-gradient(circle at 50% 50%, #151620 0%, #08090d 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-flow': 'glowFlow 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glowFlow: {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        }
      }
    },
  },
  plugins: [],
}
