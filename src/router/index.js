import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);
// 多级路由keepAlive有点问题，全部置为一级路由
// 若缓存页面并记录滚动条位置，keepAlive需设置为true
export default new Router({
  // mode: 'history',
  // base: process.env.BASE_URL,
  linkExactActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'App',
      redirect: '/home'
    },
    {
      path: '/home',
      name: 'Home',
      component: () => import('@/views/Home/Home.vue'),
      meta: {
        title: '漫画哦',
        keepAlive: true,
        auth: true,
        themeColor: '#fff'
      }
    },
    {
      path: '/find',
      name: 'Find',
      component: () => import('@/views/Find/Find.vue'),
      meta: {
        title: '发现',
        keepAlive: true,
        auth: true,
        themeColor: '#fff'
      }
    },
    {
      path: '/user',
      name: 'User',
      component: () => import('@/views/User/User.vue'),
      meta: {
        title: '我的',
        keepAlive: true,
        auth: true,
        themeColor: '#fff'
      }
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/User/Login.vue'),
      meta: {
        title: '登录',
        themeColor: '#fff'
      }
    },
    {
      path: '/detail/:id',
      name: 'Detail',
      component: () => import('@/views/Detail/Detail.vue'),
      meta: {
        title: '详情',
        auth: true,
        themeColor: '#fff'
      }
    },
    {
      path: '/Reader/:id',
      name: 'Reader',
      component: () => import('@/views/Detail/Reader.vue'),
      meta: {
        title: '阅读',
        auth: true,
        themeColor: '#000'
      }
    },
    {
      path: '*',
      name: 'error',
      component: () => import('@/views/other/ErrorPage.vue'),
      meta: {
        title: '页面未找到'
      }
    }
  ]
});
