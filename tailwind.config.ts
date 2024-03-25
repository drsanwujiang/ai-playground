import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/tw-elements/js/**/*.js",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require("tw-elements/plugin.cjs"),
    require("tailwind-typewriter")({
      wordsets: {
        welcome: {
          words: ["乐趣", "便捷", "美好"],
          writeSpeed: 0.2,
          eraseSpeed: 0.2,
          pauseBetween: 2.5,
        },
      },
    }),
  ],
};

export default config;
