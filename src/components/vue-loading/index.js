import vueLoading from './directive';

const install = (Vue, options = 'loading') => {
  if (typeof options !== 'string') {
    options = 'loading';
    console.warn("vue-loading options's type must be string");
  }
  Vue.directive(options, vueLoading(Vue));
};

export default install;
