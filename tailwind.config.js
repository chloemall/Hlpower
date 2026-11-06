/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        hoverColor: "#FFC000",
        brightColor: "#dd8036",
        backgroundColor: "#36ae9a", 
        gold: "#FFD700", // Define gold color
 
      },
      colors: {
        "dark-blue": "#1A365D",
        "golden-orange": "#FFA500",
      },
    },
  },
  plugins: [],
};
