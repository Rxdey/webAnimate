import Vue from 'vue';
import Preview from './index.vue';

const merge = (...arg) => {
  arg.map(parme => {
    if (!parme) return;
    Object.keys(parme).map(item => {
      const val = parme[item];
      if (val !== undefined) {
        arg[0][item] = val;
      }
    });
  });
  return arg[0];
};

const initInstance = () => {
  const ImagePreview = Vue.extend(Preview);
  const instance = new ImagePreview({
    el: document.createElement('div')
  });
  document.body.appendChild(instance.$el);
  return instance;
};

const ImagePreview = (option) => {
  const instance = initInstance();
  // console.log(instance);
  merge(instance, instance.$data, option);
  // merge(instance, instance.$_props, option);
  instance.show = true;
};

export default ImagePreview;
