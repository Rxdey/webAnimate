import vueRipple from './directive';

const install = (Vue, options = 'ripple') => {
  if (typeof options !== 'string') {
    options = 'ripple';
    console.warn("vue-ripple options's type must be string");
  }
  Vue.directive(options, vueRipple(Vue));
};

export default install;
