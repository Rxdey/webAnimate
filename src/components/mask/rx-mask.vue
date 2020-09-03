<template>
  <transition name="fade">
    <div class="rx-mask" v-show="show" @click="maskClick"></div>
  </transition>
</template>

<script>

export default {
  name: 'rx-mask',
  data () {
    return {
      show: false
    };
  },
  methods: {
    maskClick () { }
  }
};
</script>

<style lang="less">
.rx-mask {
  z-index: 2000;
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.5);
  transition: opacity 0.3s;
}
.fade-enter-active,
.fade-leave-active {
  opacity: 1;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
