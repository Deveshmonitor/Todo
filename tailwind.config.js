/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ['./App.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        Bold1: 'WinkySans-Bold',
        Medium1: 'WinkySans-Medium',
        Regular1: 'WinkySans-Book',
        Italic1: 'WinkySans-ltalic',
        ExtraBold1: 'WinkySans-ExtraBold',
        Light1: 'WinkySans-Light',
        Black1: 'WinkySans-Black',
      },
    },
  },
  plugins: [],
};
