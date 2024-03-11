/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary": {
          1: "#bb86fc",
          2: "#3700b3",
        },
        "secondary": {
          1: "#03dac6",
          2: "#03dac6"
        },
        "onPrimary": {
          1: "#000000",
          2: "#ffffff"
        },
        "onSecondary": {
          1: "#000000",
          2: "#000000"
        },
        "onBackground": "#ffffff",
        "error": "#cf6679",
        "onError": "#000000",
        "background": "#121212",
      },
    },
  },
  plugins: [],
};