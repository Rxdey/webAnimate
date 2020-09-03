<template>
  <div id="app" :style="deviceIsPC && `max-width: 10rem`">
    <div class="route-block">
      <route-transition class="vue-route">
        <keep-alive :include="includedComponents">
          <router-view class="page" />
        </keep-alive>
      </route-transition>
    </div>
    <div class="nav-block hide-by-resize" v-show="hasNavPath.includes($route.path)">
      <nav class="nav-bar">
        <router-link :to="nav.url" tag="div" class="nav-bar--item" v-for="(nav, index) in navList" :key="index" v-ripple>
          <p class="icon">
            <rx-icon :icon="nav.icon" />
          </p>
          <p class="name">{{nav.title}}</p>
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script>
import { RouteTransition } from '@/components';
import { deviceIsPC } from '@/common/utils/tool';
import { addClass, removeClass } from '@/common/utils/dom';

export default {
  data () {
    return {
      deviceIsPC: deviceIsPC(),
      hasNavPath: ['/home', '/find', '/user'],
      deviceHeight: 0,
      navList: [
        { title: '订阅', url: '/home', icon: 'icon-wenjian' },
        { title: '发现', url: '/find', icon: 'icon-sousuo' },
        { title: '我的', url: '/user', icon: 'icon-wode' }
      ]
    };
  },
  mounted () {
    // 移动端，class为hide-by-resize调用输入法自动隐藏
    if (!deviceIsPC()) {
      this.deviceHeight = window.innerHeight;
      window.addEventListener('resize', () => {
        if (window.innerHeight < this.deviceHeight - 200) {
          document.querySelectorAll('.hide-by-resize').forEach(item => {
            addClass(item, 'hide');
          });
        } else {
          document.querySelectorAll('.hide-by-resize').forEach(item => {
            removeClass(item, 'hide');
          });
        }
      });
    }
  },
  components: {
    RouteTransition
  },
  computed: {
    includedComponents () {
      return this.$store.state.keepAlive.join();
    }
  }
};
</script>
<style lang="less">
@import url("./assets/css/public.less");
#app {
  // min-width: 750px;
  width: 100%;
  height: 100%;
  background-color: #f7f8fa;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
  font-size: 14px;
  display: flex;
  flex-flow: column;
}
.route-block {
  position: relative;
  flex: 1;
  height: 1px;
}
.page {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background: #f7f7f7;
  box-sizing: border-box;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
.nav-bar {
  background: #fff;
  box-shadow: 0 0 16px #eee;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  position: relative;
  z-index: 2;
  &--item {
    flex: 1;
    text-align: center;
    padding: 20px 15px;
    font-size: 11px;
    color: #999;
    position: relative;
    &.active {
      // .color-main;
      color: #333;
      // font-weight: 600;
    }
    .name {
      // transform: scale(0.9);
    }
    .rx-icon {
      font-size: 20px;
    }
  }
}
</style>
