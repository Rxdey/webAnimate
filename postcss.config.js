module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-px-to-viewport-rxdey': {
      viewportWidth: 750,
      unitPrecision: 3,
      viewportUnit: 'rem',
      selectorBlackList: ['.ignore'],
      propIgnoreList: ['font-size'],
      minPixelValue: 1,
      multiple: 10,
      // exclude: ['vue-loading-rx'],
      rules: {
        path: ['vant', 'rx-group', 'vue-loading'],
        fn (pixels, vw) {
          return `${vw * 2}rem`;
        }
      }
    }
  }
};
