/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#07080C",
          soft: "#0C0E15",
          raised: "#12151F",
        },
        gold: {
          DEFAULT: "#D9B979",
          soft: "#EAD6A8",
          deep: "#A8863F",
        },
        line: "rgba(236,216,172,0.16)",
        amber: "#E5B567",
        cyan: "#8CCFD0",
        coral: "#E27D6F",
        lilac: "#A79BE0",
        paper: "#F4EFE4",
        mist: "#B4AEA2",
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Georgia", "serif"],
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
          "100%": {
            transform: "translateY(110%) translateX(10px)",
            opacity: 0,
          },
        },
        shimmer: {
          "0%": { backgroundPosition: "-400px 0" },
          "100%": { backgroundPosition: "400px 0" },
        },
        orbA: {
          "0%": { transform: "translate3d(0,0,0) scale(1)" },
          "100%": { transform: "translate3d(6vw,8vh,0) scale(1.15)" },
        },
        orbB: {
          "0%": { transform: "translate3d(0,0,0) scale(1.1)" },
          "100%": { transform: "translate3d(-8vw,-6vh,0) scale(0.9)" },
        },
        orbC: {
          "0%": { transform: "translate3d(0,0,0) scale(0.95)" },
          "100%": { transform: "translate3d(5vw,-9vh,0) scale(1.2)" },
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
        "orb-a": "orbA 22s ease-in-out infinite alternate",
        "orb-b": "orbB 26s ease-in-out infinite alternate",
        "orb-c": "orbC 30s ease-in-out infinite alternate",
        "pop-in": "popIn 0.25s cubic-bezier(0.22, 1, 0.36, 1) both",
      },
    },
  },
  plugins: [],
};
