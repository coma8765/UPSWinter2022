module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
    fontFamily: {
      'general': ["Montserrat"]
    },
    fontSize: {
      title: "32px",
      'sup-title': "14px",
      general: "16px",
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
