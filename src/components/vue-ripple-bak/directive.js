import rippleTemplate from './ripple.vue';

/**
 * ripple 波纹点击
 * @param {Object} Vue
 */
const vueRipple = (Vue) => {
  const Ripple = Vue.extend(rippleTemplate);
  const createRipple = (el) => {
    if (el.style.position === '') el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.appendChild(el.ripple.$el);
  };
  return {
    bind (el, binding) {
      el.ripple = new Ripple({
        el: document.createElement('div')
      });
      createRipple(el, binding);
    }
    // unbind (el) {
    //   el.removeChild(el.ripple);
    // }
  };
};

export default vueRipple;
