/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",        // App Router এর জন্য
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",      // Pages Router এর জন্য (আপনার member.tsx এখানে আছে)
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // সব কম্পোনেন্টের জন্য
    "./src/**/*.{js,ts,jsx,tsx,mdx}",        // যদি src ফোল্ডার ব্যবহার করেন
  ],
  theme: {
    extend: {
      spacing: {
        '100': '400px',
        '125': '500px',
        '45': '180px',
      },
      borderRadius: {
        '4xl': '2rem', // আপনার ড্যাশবোর্ডের rounded-4xl এর জন্য এটি জরুরি
      }
    },
  },
  plugins: [],
}