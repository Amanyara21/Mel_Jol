/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", './Screens/**/*.{js,jsx,ts,tsx}','./Components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'app-themes':'#5e17eb',
      }
    },
  },
  plugins: [],
}

