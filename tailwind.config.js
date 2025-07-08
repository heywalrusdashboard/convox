module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0a0a0a',
        surface: '#18181b',
        primary: '#6366f1', // indigo-500
        secondary: '#a21caf', // purple-700
        accent: '#ec4899', // pink-500
        muted: '#27272a',
        text: '#f4f4f5',
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-main': 'linear-gradient(90deg, #6366f1 0%, #a21caf 50%, #ec4899 100%)',
        'gradient-accent': 'linear-gradient(90deg, #a21caf 0%, #ec4899 100%)',
      },
      boxShadow: {
        glass: '0 4px 32px 0 rgba(0,0,0,0.25)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}; 