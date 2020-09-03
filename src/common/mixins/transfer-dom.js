const transferDom = {
  // bind(el) {
  //   // console.dir(el);
  // },
  inserted(el) {
    document.body.appendChild(el);
  },
  // update(el, binding) {},
  unbind(el) {
    try {
      document.body.removeChild(el);
    } catch (err) {
      console.warn('dom not found');
    }
  }
};
export default transferDom;
