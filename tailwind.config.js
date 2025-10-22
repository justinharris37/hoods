/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Hoods brand palette
        evergreenBlue: "#0D3B66",  // deep blue-green
        amber: "#FFC145"           // amber accent
      },
      borderRadius: {
        '2xl': '1rem'
      }
    },
  },
  plugins: [],
};
