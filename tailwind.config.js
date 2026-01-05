/** @type {import('tailwindcss').Config} */
export default {
  // [FACTS]: The content array MUST be updated to find your new paths
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'serif'], // [ANALYSIS]: Restores high-fidelity typography
      },
      colors: {
        dark: '#020617', // [ANALYSIS]: Deep space base color
      }
    },
  },
  plugins: [],
}