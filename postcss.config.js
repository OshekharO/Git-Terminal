module.exports = {
  plugins: [
    require('@tailwindcss/postcss'),
    require('autoprefixer'),
    require('cssnano')({
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
        normalizeWhitespace: true,
        minifyFontValues: true,
        minifyGradients: true,
      }]
    })
  ]
}
