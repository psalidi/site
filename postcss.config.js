module.exports = ctx => ({
  plugins: {
    // 'postcss-import': {},
    'postcss-easy-import': {
      extensions: '.css'
    },
    'postcss-inline-svg': {},
    'postcss-mixins': {},
    'postcss-simple-vars': {},
    'postcss-nested': {},
    'autoprefixer': {},
    cssnano: {},
  }
});
