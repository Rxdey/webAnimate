import Vue from 'vue';
import loadingTemple from './loading.vue';

// function merge (...arg) {
//   arg.map(parme => {
//     if (!parme) return;
//     Object.keys(parme).map(item => {
//       const val = parme[item];
//       if (val !== undefined) {
//         arg[0][item] = val;
//       }
//     });
//   });
//   return arg[0];
// }

let instance;
const LoadingBox = Vue.extend(loadingTemple);

const initInstance = () => {
  if (!document.querySelector('#rx-loading')) {
    instance = new LoadingBox({
      el: document.createElement('div')
    });
    instance.$el.id = 'rx-loading';
    document.body.appendChild(instance.$el);
    return instance.$el;
  }
  return document.querySelector('#rx-loading');
};
const loading = (opt) => {
  initInstance().style.display = opt ? 'block' : 'none';
};

export default loading;
