import Vue from 'vue';
import 'lib-flexible';
import '@vant/touch-emulator';
import { Lazyload, button, Dialog, Toast, Cell, CellGroup, Tab, Tabs, List, Skeleton, PullRefresh, Icon } from 'vant';
import model from '@/model';
import mixins from '@/common/mixins';
import { RxIcon } from '@/components/index';
import App from './App.vue';
import router from './router';
import store from './store';
import loading from './components/vue-loading/index';
import { changeTitle, rxLocalStorage } from './common/utils';
import transferDom from './common/mixins/transfer-dom';
import ripple from './components/vue-ripple/index';
import '@/assets/css/reset.less';
import './registerServiceWorker';

Vue.use(Tab);
Vue.use(Tabs);
Vue.use(List);
Vue.use(PullRefresh);
Vue.use(button);
Vue.use(Dialog);
Vue.use(Toast);
Vue.use(RxIcon);
Vue.use(Icon);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Skeleton);
Vue.use(loading, 'loading');
Vue.mixin(mixins);
Vue.use(ripple);
Vue.use(Lazyload, {
  preLoad: 1.3,
  attempt: 3,
  loading: './image/default.png',
  error: './image/default.png'
});
Dialog.setDefaultOptions({
  closeOnPopstate: true
});
Vue.prototype.$model = model;
Vue.directive('transferDom', transferDom);
router.beforeEach((to, from, next) => {
  if ((!rxLocalStorage.getItem('username') || !rxLocalStorage.getItem('userId')) && to.meta.auth) {
    Toast('请先登录!');
    next('/login');
    return;
  }
  next();
});
router.beforeResolve((to, from, next) => {
  changeTitle(to.meta.title);
  // window.pending.forEach((item, index) => {
  //   item.cancel();
  //   window.pending.splice(index, 1);
  // });
  next();
});
Vue.config.productionTip = false;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
