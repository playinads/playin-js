module.exports = {
  productionSourceMap: false,
  configureWebpack: {
    optimization: {
      splitChunks: false
    },
    output: {
      filename: 'js/playin.js'
    }
  },
  css: {
    extract: false,
  }
};