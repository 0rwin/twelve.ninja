/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // The World Colors
        ink: {
          950: '#050505', // Void
          900: '#0a0a0a', // Deep Background
          800: '#121212', // Card Backgrounds
          700: '#1e1e1e', // Borders
        },
        // The UI Colors
        parchment: {
          100: '#e8e6df', // High Contrast Text
          200: '#dcd8c8', // Body Text
          500: '#c2b280', // Gold/Tan Accents
        },
        // The "Danger/Action" Color
        hanko: {
          500: '#cd3838', // Stamp Red
          600: '#a32424', // Hover Red
        },
        uiBg: '#0d0d0f',
        panel: 'rgba(255,255,255,0.05)'
      },
      fontFamily: {
        // We will load these next
        sans: ['Inter', 'sans-serif'], // UI
        serif: ['Cinzel', 'serif'], // Headings/Lore
      },
      backgroundImage: {
        // A subtle grain to make it look like paper, not plastic
        'paper-texture': "url('https://grainy-gradients.vercel.app/noise.svg')",
      }
    },
  },
  plugins: [],
}
