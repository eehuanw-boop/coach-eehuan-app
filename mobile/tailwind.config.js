/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        // Warm, editorial neutrals — the page itself, not a card.
        paper: {
          DEFAULT: "#F7F5EF",
          dark: "#15140F",
        },
        surface: {
          DEFAULT: "#FBFAF6",
          dark: "#1C1A14",
        },
        ink: {
          DEFAULT: "#1C1B17",
          secondary: "#615E54",
          muted: "#9B978A",
          inverted: "#F7F5EF",
        },
        hairline: {
          DEFAULT: "#E4E1D6",
          dark: "#33312A",
        },
        // Deep forest green — desaturated, sparingly used.
        brand: {
          50: "#EAF1EC",
          100: "#CFE0D4",
          300: "#6FA383",
          500: "#2C6B49",
          600: "#1F5738",
          700: "#17452C",
          900: "#0D2A1A",
        },
        // Antique gold — the "magic number" accent.
        gold: {
          100: "#F3E6C9",
          300: "#D6AD64",
          500: "#B8873B",
          700: "#8C6428",
        },
        status: {
          good: "#0CA30C",
          warning: "#FAB219",
          critical: "#D03B3B",
        },
      },
      fontFamily: {
        serif: ["Fraunces_500Medium"],
        "serif-semibold": ["Fraunces_600SemiBold"],
        sans: ["Inter_400Regular"],
        "sans-medium": ["Inter_500Medium"],
        "sans-semibold": ["Inter_600SemiBold"],
        "sans-bold": ["Inter_700Bold"],
      },
      letterSpacing: {
        tightest: "-0.03em",
        wide: "0.08em",
        widest: "0.16em",
      },
    },
  },
  plugins: [],
};
