/* @type {import('tailwindcss').Config} */

export default {
  content: ["./App.jsx", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e', // Primary accent (Python green highlight)
          600: '#16a34a', // Hover states
          700: '#15803d',
        },
        surface: {
          light: '#f8fafc', // Light background slate
          dark: '#0f172a',  // Dark background slate for code views
          card: '#1e293b',  // Card background
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],   // Primary UI text
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'], // Code execution / snippets
      }
    },
  },
  plugins: [],
}