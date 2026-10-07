module.exports = {
  presets: [require("./src/design-system/tailwind.preset.cjs")],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};
