import Vue from 'vue';

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

export default function mount (Component, data = {}) {
  const Mask = Vue.extend(Component);
  const instance = new Mask({
    el: document.createElement('div')
  });
  document.body.appendChild(instance.$el);
  merge(instance, instance.$data, data);
  return instance;
}
