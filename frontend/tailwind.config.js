/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  // In Tailwind v4, configuration is now done via CSS @theme
  // This file is kept for compatibility but theme is defined in index.css
}
