module.exports = {
  content: ['./views/*.ejs', './views/**/*.ejs'],
  theme: {
    extend: {
      colors: {
        background: '#FFFBDB',
        navbarbackground: '#625834',
        navbarborder: '#30362F',
        navbarhover: '#30362f',
        navbarhoverborder: '#da7422',
      },
      fontFamily: {
        Courier: ['Courier New', 'monospace'],
      },
    },
  },
  plugins: [require('tailwindcss')],
};
