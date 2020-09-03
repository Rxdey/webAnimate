module.exports = {
  publicPath: './',
  assetsDir: 'static',
  productionSourceMap: false,
  devServer: {
    disableHostCheck: true
  },
  pwa: {
    name: '漫画哦',
    themeColor: '#fff',
    msTileColor: '#fff',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black-translucent'
  }
};
