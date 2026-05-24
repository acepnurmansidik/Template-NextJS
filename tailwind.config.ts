import type { Config } from "tailwindcss";

const config: Config = {
  // KUNCI UTAMA: Beritahu Tailwind untuk mendengarkan class "dark" di tag HTML
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // konfigurasi extend kamu...
    },
  },
  plugins: [],
};

export default config;
