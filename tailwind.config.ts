/** @type {import('tailwindcss').Config} */
module.exports = {
  // darkMode: "class", // ← penting!
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "base-dark-mode": "#161618",
        "primary-dark-mode": "#222124",
        "secondary-dark-mode": "#28272a",
        "third-dark-mode": "#2a2a2c",
        "th-dark-mode": "#848386",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 10px 30px -15px rgba(135, 90, 123, 0.15)",
      },
    },
  },
  plugins: [],
};
