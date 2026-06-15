/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdf7',
          100: '#dcfce9',
          500: '#2b6a55', // Hover (Fresh Chalkline)
          600: '#1f4e3d', // Primary Brand (Blackboard) - HIGH CONTRAST
          900: '#064e3b',
          950: '#022c22', // Deepest green for extreme contrast borders
        },
        insight: {
          enrich: '#10b981',   // Emerald Green
          reteach: '#ef4444',  // Rose Red
          review: '#f59e0b',   // Amber Yellow
        },
        background: '#fafafa', // Eraser Dust / Warm Paper
        surface: '#ffffff',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
