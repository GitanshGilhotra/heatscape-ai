/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          dark: "#07090e",
          card: "#0d111a",
          glass: "rgba(13, 17, 26, 0.75)"
        },
        cyan: {
          glow: "#00f3ff",
          dark: "#008891"
        },
        thermal: {
          orange: "#ff5500",
          yellow: "#ffaa00"
        },
        heat: {
          red: "#ff2a5f",
          dark: "#990026"
        },
        neon: {
          lime: "#00ff88",
          emerald: "#10b981"
        },
        atmospheric: {
          blue: "#0088ff",
          indigo: "#4f46e5"
        }
      },
      fontFamily: {
        mono: ['"Space Mono"', 'monospace'],
        sans: ['Inter', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif']
      },
      boxShadow: {
        'cyan-glow': '0 0 25px rgba(0, 243, 255, 0.35)',
        'heat-glow': '0 0 25px rgba(255, 42, 95, 0.4)',
        'lime-glow': '0 0 25px rgba(0, 255, 136, 0.35)',
        'orange-glow': '0 0 25px rgba(255, 85, 0, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'scan': 'scan 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' },
        }
      }
    },
  },
  plugins: [],
}
