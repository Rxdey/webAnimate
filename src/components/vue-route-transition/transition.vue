<template>
  <div class="vue-route-transition">
    <transition :name="state.pageDirection" @leave="setRouterMap" @after-leave="animateEnd">
      <slot></slot>
    </transition>
  </div>
</template>
<script>
let localSessionRouteChain = sessionStorage.getItem('$$routeChain') || [];
export default {
  name: 'vue-route-transition',
  props: {
    keepAlive: {
      type: Boolean,
      default: false
    }
  },
  data () {
    try {
      localSessionRouteChain = this.$route.path !== '/' ? JSON.parse(localSessionRouteChain) : [];
    } catch (error) {
      localSessionRouteChain = [];
    }
    return {
      state: {
        addCount: localSessionRouteChain.length,
        routerMap: {},
        pageDirection: 'fade',
        routeChain: localSessionRouteChain
      }
    };
  },
  methods: {
    animateEnd () {
      if (this.$route.meta.keepAlive) {
        const scrollTop = JSON.parse(window.sessionStorage.getItem('scroll')) || false;
        if (scrollTop && scrollTop[this.$route.path]) {
          const conf = scrollTop[this.$route.path];
          conf.index = conf.index || 0;
          const tag = conf.target.split(';');
          if (tag.length > 1) {
            if (document.querySelectorAll(tag[0])[conf.index].querySelector(tag[1])) {
              document.querySelectorAll(tag[0])[conf.index].querySelector(tag[1]).scrollTop = conf.scrollTop;
            }
          } else {
            document.querySelector(conf.target).scrollTop = conf.scrollTop;
          }
        }
      }
    },
    addRouteChain (route) {
      if (this.state.addCount === 0 && localSessionRouteChain.length > 0) {
        // 排除刷新的时候
        this.state.addCount = 1;
      } else if (
        (this.state.addCount !== 0
          && this.state.routeChain[this.state.routeChain.length - 1].path
          !== route.path)
        || this.state.addCount === 0
      ) {
        this.state.routeChain.push({
          path: route.path
        });
        sessionStorage.setItem(
          '$$routeChain',
          JSON.stringify(this.state.routeChain)
        );
        this.state.addCount += 1;
      }
    },
    popRouteChain () {
      this.state.routeChain.pop();
      sessionStorage.setItem(
        '$$routeChain',
        JSON.stringify(this.state.routeChain)
      );
    },
    setPageDirection ({ dir, to, from }) {
      this.state.pageDirection = dir;
      this.state.routerMap.to = to.path;
      this.state.routerMap.from = from.path;
    },
    setRouterMap () {
      try {
        const dir = this.state.pageDirection;
        const to = this.state.routerMap.to.replace(/\//g, '_');
        const from = this.state.routerMap.from.replace(/\//g, '_');
        if (dir === 'slide-left') {
          // 进入
          this.state.routerMap[from] = document.getElementById(from).scrollTop;
        } else if (dir === 'slide-right') {
          // 返回
          if (this.keepAlive === true && this.$route.meta.keepAlive !== false) {
            document.getElementById(to).scrollTop = this.state.routerMap[to];
          }
        }
      } catch (error) { return false; }
    }
  },
  mounted () {
    this.$router.beforeEach((to, from, next) => {
      // 定义一个可以记录路由路径变化的数据，这里用sessionStorage,或者在window.routeChain等变量
      const routeLength = this.state.routeChain.length;
      if (routeLength === 0 || this.state.addCount === 0) {
        this.setPageDirection({ dir: 'slide-left', to, from });
        this.addRouteChain(from);
        this.addRouteChain(to);
      } else if (routeLength === 1) {
        this.setPageDirection({ dir: 'slide-left', to, from });
        this.addRouteChain(to);
      } else {
        const lastBeforeRoute = this.state.routeChain[routeLength - 2];
        if (lastBeforeRoute.path === to.path && to.meta.slideLeft !== true) {
          this.popRouteChain();
          this.setPageDirection({ dir: 'slide-right', to, from });
        } else {
          this.addRouteChain(to);
          this.setPageDirection({ dir: 'slide-left', to, from });
        }
      }
      next();
    });
  }
};
</script>

<style lang="less">
.vue-route-transition {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  backface-visibility: hidden;
  perspective: 1000;
  box-sizing: border-box;
}
.fade-enter-active {
  animation: pageFadeIn 300ms cubic-bezier(0.55, 0, 0.1, 1) forwards;
}
@keyframes pageFadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
/*路由前进，退出*/
.slide-left-leave-active {
  animation: pageFromCenterToLeft 300ms cubic-bezier(0.55, 0, 0.1, 1) forwards;
  z-index: 1;
}
@keyframes pageFromCenterToLeft {
  from {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
  to {
    opacity: 0.5;
    transform: translate3d(-40%, 0, 0);
  }
}

/*路由后退，进入*/
.slide-right-enter-active {
  animation: pageFromLeftToCenter 300ms cubic-bezier(0.55, 0, 0.1, 1) forwards;
  z-index: 1;
}
@keyframes pageFromLeftToCenter {
  from {
    opacity: 0.5;
    transform: translate3d(-40%, 0, 0);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
}
/*路由后退，退出*/
.slide-right-leave-active {
  animation: pageFromCenterToRight 300ms cubic-bezier(0.55, 0, 0.1, 1) forwards;
  z-index: 10;
  box-shadow: -3px 0 5px rgba(0, 0, 0, 0.1);
}
@keyframes pageFromCenterToRight {
  from {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
  to {
    transform: translate3d(100%, 0, 0);
    opacity: 1;
  }
}
/*路由前进，进入*/
.slide-left-enter-active {
  animation: pageFromRightToCenter 300ms cubic-bezier(0.55, 0, 0.1, 1) forwards;
  z-index: 10;
  box-shadow: -3px 0 5px rgba(0, 0, 0, 0.1);
}
@keyframes pageFromRightToCenter {
  from {
    transform: translate3d(100%, 0, 0);
    opacity: 1;
  }
  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}
</style>
