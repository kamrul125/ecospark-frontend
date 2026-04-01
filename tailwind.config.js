/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // যদি App Router ব্যবহার করেন তবে এটি যোগ করুন
  ],
  theme: {
    extend: {
      spacing: {
        '100': '400px',
        '125': '500px',
        '45': '180px',
      },
      borderRadius: {
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}