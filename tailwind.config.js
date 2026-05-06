/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './resources/js/**/*.{js,jsx}',
        './resources/views/**/*.blade.php',
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['IBM Plex Sans', 'sans-serif'],
                mono: ['IBM Plex Mono', 'monospace'],
            },
            colors: {
                bg: {
                    base:    '#0e1117',
                    surface: '#161b24',
                    raised:  '#1e2533',
                    hover:   '#242c3d',
                },
                border: {
                    DEFAULT: '#2a3347',
                    light:   '#1e2533',
                },
                accent: {
                    DEFAULT: '#3b82f6',
                    dim:     '#1d3a6e',
                },
                critical: '#ef4444',
                high:     '#f97316',
                medium:   '#eab308',
                low:      '#22c55e',
            },
        },
    },
    plugins: [],
};
