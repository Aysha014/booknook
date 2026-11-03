import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: {
    colors: { ink: "#252333", coral: "#F26B5B", cream: "#FFF9F1", lavender: "#E9E2FF", butter: "#FFE79A", mint: "#DDF2E8" },
    fontFamily: { sans: ["Arial", "Helvetica", "sans-serif"] },
    boxShadow: { soft: "0 16px 45px rgba(45, 36, 55, .08)" }
  }},
  plugins: []
};
export default config;
