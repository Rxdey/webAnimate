<template>
  <div class="rx-ripple" ref="ripple">
    <div class="rx-ripple--container" ref="container" @contextmenu="contextmenu">
      <transition-group tag="div" name="ripple">
        <template v-for="(item, index) in rippleList">
          <div class="rx-ripple__ripple" @touchend="handleUp" :style="{
            width: item.width + 'px',
            height: item.width + 'px',
            'border-radius': item.width + 'px',
            top: item.top + 'px',
            left: item.left + 'px'
            }" :key="index"></div>
        </template>
      </transition-group>
    </div>
  </div>
</template>
<script>
// @touchstart.stop="handleClick" @touchend="handleUp" @mousedown="handleClick" @mouseup="handleUp"

const isTouch = 'ontouchstart' in window;
const touchSart = isTouch ? 'touchstart' : 'mousedown';
const touchEnd = isTouch ? 'touchend' : 'mouseup';
const touchMove = isTouch ? 'touchmove' : 'mousemove';

export default {
  name: 'ripple',
  data() {
    return {
      rippleList: [],
      width: 500
    };
  },
  mounted() {
    this.$refs.container.addEventListener(touchSart, this.handleClick.bind(this), false);
    this.$refs.container.addEventListener(touchEnd, this.handleUp.bind(this), false);
    this.$refs.container.addEventListener(touchMove, this.handleMove.bind(this), false);
  },
  methods: {
    handleUp(e) {
      setTimeout(() => {
        this.rippleList.splice(0, 1);
      }, 100);
    },
    handleMove(e) {
      this.stopListenerMove();
      this.handleUp(e);
    },
    handleClick(e) {
      // e.stopPropagation();
      // 判断是否为touch事件
      this.startListenerMove();
      if (isTouch && !e.touches) return;
      const width = this.$refs.container.clientWidth;
      const height = this.$refs.container.clientHeight;
      const { clientX, clientY } = !isTouch ? e : e.touches[0];
      const rippleWidth = Math.sqrt(width * width + height * height) * 2;
      const res = this.$refs.ripple.parentNode.getClientRects()[0];
      const offsetTop = clientY - res.top;
      const offsetLeft = clientX - res.left;
      this.rippleList.push({
        width: rippleWidth,
        top: offsetTop - (rippleWidth / 2),
        left: offsetLeft - (rippleWidth / 2)
      });
    },
    contextmenu(e) {
      window.event.returnValue = false;
      this.handleUp(e);
      return false;
    },
    stopListenerMove() {
      this.$refs.container.removeEventListener(touchMove, this.handleMove.bind(this), false);
    },
    startListenerMove() {
      this.$refs.container.addEventListener(touchMove, this.handleMove.bind(this), false);
    }
  }
};
</script>

<style lang="less">
.rx-ripple {
  &--container {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
  &__ripple {
    background: currentColor;
    position: absolute;
    opacity: 0.1;
    transform: scale(1);
    transition: opacity 2.5s cubic-bezier(0.23, 1, 0.32, 1),
      transform 2s cubic-bezier(0.23, 1, 0.32, 1);
    user-select: none;
  }
}
.ripple-enter {
  -webkit-transform: scale(0);
  transform: scale(0);
}
.ripple-leave-active {
  opacity: 0 !important;
}
</style>
