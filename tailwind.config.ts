import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#235789",
        secondary: "#C1292E",
        accent: "#F1D302",
        light: "#FDFFFC",
        dark: "#020100",
        button: "#b1dae7",
        'button-text': "#234567"
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        "aurora-text": "aurora 8s ease infinite",
        'button-expand': 'button-width 0.3s ease-in-out forwards',
        'meteor-effect': "meteor 5s linear infinite",
      },
      keyframes: {
        aurora: {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        'button-width': {
          '0%': { width: '45px' },
          '100%': { width: '100%' },
        },
        meteor: {
          "0%": { transform: "rotate(215deg) translateX(0)", opacity: "1" },
          "70%": { opacity: "1" },
          "100%": {
            transform: "rotate(215deg) translateX(-1000px)",
            opacity: "0",
          },
        },
      },
      fontFamily: {
        ubuntu: ['Ubuntu', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
