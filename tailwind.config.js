/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#090D1A",
          soft: "#0E1526",
          raised: "#141C33",
        },
        line: "rgba(255,255,255,0.09)",
        amber: "#FFB648",
        cyan: "#5FD4D6",
        coral: "#FF6B5E",
        lilac: "#9C8CF5",
        paper: "#F5F7FB",
        mist: "#8B96AF",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        fa: ["Vazirmatn", "sans-serif"],
      },
      keyframes: {
        riseIn: {
          from: { opacity: 0, transform: "translateY(14px)" },
          to: { opacity: 1, transform: "translateY(0)" },
        },
        driftSlow: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-40px)" },
        },
        fallLine: {
          "0%": { transform: "translateY(-10%)", opacity: 0 },
          "10%": { opacity: 0.6 },
          "100%": { transform: "translateY(110%)", opacity: 0 },
        },
        fallDot: {
          "0%": { transform: "translateY(-10%) translateX(0)", opacity: 0 },
          "10%": { opacity: 0.8 },
          "100%": { transform: "translateY(110%) translateX(10px)", opacity: 0 },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        popIn: {
          "0%": { opacity: 0, transform: "scale(0.94)" },
          "100%": { opacity: 1, transform: "scale(1)" },
        },
      },
      animation: {
        "rise-in": "riseIn 0.55s cubic-bezier(0.22, 1, 0.36, 1) both",
        drift: "driftSlow 40s linear infinite alternate",
        "fall-line": "fallLine linear infinite",
        "fall-dot": "fallDot linear infinite",
        shimmer: "shimmer 1.6s ease-in-out infinite",
        "pop-in": "popIn 0.25s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};
