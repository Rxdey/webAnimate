import RouteTransition from './transition.vue';
import Layout from './layout.vue';

const install = (Vue) => {
  Vue.component(RouteTransition.name, RouteTransition);
  Vue.component(Layout.name, Layout);
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install
};
