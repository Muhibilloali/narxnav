/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}


// module.exports = {
//   theme: {
//     extend: {
//       keyframes: {
//         scroll: {
//           '0%': { transform: 'translateX(100%)' },
//           '100%': { transform: 'translateX(-100%)' },
//         },
//       },
//       animation: {
//         scroll: 'scroll 50s linear infinite',
//       },
//     },
//   },
//   plugins: [],
// };



// module.exports = {
//   darkMode: 'class', // or 'media' or 'class'
//   content: [
//     "./src/**/*.{js,jsx,ts,tsx}",
//   ],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }

// module.exports = {
//   theme: {
//     extend: {
//       screens: {
//         'sm': '640px',
//         'md': '768px',
//         'lg': '1024px',
//         'xl': '1280px',
//         '2xl': '1536px',
//       },
//     },
//   },
//   plugins: [],
// };
