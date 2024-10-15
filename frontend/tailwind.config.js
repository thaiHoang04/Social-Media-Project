/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx}', // Include all JavaScript and TypeScript files in the src directory
    ],
    theme: {
        extend: {}, // You can extend your theme here if needed
    },
    plugins: [
        require('daisyui'), // Include DaisyUI plugin
    ],
};
