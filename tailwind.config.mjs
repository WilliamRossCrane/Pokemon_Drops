/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        // Pokémon-inspired palette — no official branding, just vibes
        pokeblue: {
          50: "#eef5ff",
          100: "#d9e9ff",
          200: "#bcd6ff",
          300: "#8eb9ff",
          400: "#5990ff",
          500: "#3068fb",
          600: "#1a49f0",
          700: "#1438dc",
          800: "#172eb3",
          900: "#192c8d",
          950: "#131c56",
        },
        pokered: {
          50: "#fff1f1",
          100: "#ffe1e1",
          200: "#ffc7c7",
          300: "#ff9e9e",
          400: "#ff6464",
          500: "#f83232",
          600: "#e51414",
          700: "#c10d0d",
          800: "#a00f0f",
          900: "#841414",
          950: "#480404",
        },
        pokeyellow: {
          400: "#ffd700",
          500: "#f5c400",
        },
        surface: {
          DEFAULT: "#0f1117",
          card: "#1a1d27",
          elevated: "#22263a",
        },
      },
      fontFamily: {
        display: ["'Nunito'", "system-ui", "sans-serif"],
        body: ["'Inter'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "fade-in": "fadeIn 0.4s ease forwards",
        "slide-up": "slideUp 0.4s ease forwards",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
