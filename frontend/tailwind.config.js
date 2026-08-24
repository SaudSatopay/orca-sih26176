/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Same palette as the SIH deck so the demo and the slides feel like one product.
        ocean: {
          950: "#0B1220",
          900: "#13223C",
          800: "#1B3054",
          700: "#1F497D",
          600: "#2A5FA0",
          500: "#0070C0",
          300: "#7FB2E5",
          100: "#DCE9F7",
          50: "#F4F8FC",
        },
        teal: { 700: "#0F5A6E", 500: "#149DBF" },
        risk: {
          low: "#1E7A4D",
          moderate: "#B8860B",
          high: "#C55A11",
          extreme: "#B3372B",
        },
      },
      fontFamily: {
        sans: ["Inter", "Segoe UI", "Nirmala UI", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Consolas", "monospace"],
      },
      keyframes: {
        ping2: {
          "0%": { transform: "scale(1)", opacity: "0.6" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
        rise: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        ping2: "ping2 2s cubic-bezier(0,0,0.2,1) infinite",
        rise: "rise .35s ease-out both",
      },
    },
  },
  plugins: [],
};
