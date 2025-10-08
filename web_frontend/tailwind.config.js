/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        ocean: {
          primary: "#2563EB",
          secondary: "#F59E0B",
          success: "#F59E0B",
          error: "#EF4444",
          text: "#111827",
          surface: "#ffffff",
          background: "#f9fafb"
        }
      },
      backgroundImage: {
        'ocean-gradient': "linear-gradient(to right, rgba(59,130,246,0.1), #f9fafb)"
      },
      boxShadow: {
        soft: "0 2px 8px rgba(0,0,0,0.06)"
      },
      borderRadius: {
        xl: "14px"
      }
    },
  },
  plugins: [],
};
