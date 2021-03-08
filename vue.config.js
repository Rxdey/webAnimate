module.exports = {
  publicPath: './',
  assetsDir: 'static',
  productionSourceMap: false,
  devServer: {
    disableHostCheck: true,
    proxy: {
      '/api': { // 代理api
        target: 'http://127.0.0.1:9006', // 服务器api地址
        changeOrigin: true,
        ws: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  pwa: {
    name: '漫画哦',
    themeColor: '#fff',
    msTileColor: '#fff',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black-translucent'
  }
};
