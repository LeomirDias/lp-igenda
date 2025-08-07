/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{astro,html,js,jsx,ts,tsx,vue}",
    ],
    theme: {
        extend: {
            fontFamily: {
                'sans': ['Roboto', 'sans-serif'],
                'roboto': ['Roboto', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
