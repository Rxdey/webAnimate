<template>
  <div class="router-popup" v-show="currentValue">
    <popup v-on="$listeners" safe-area-inset-bottom class="full-popup" v-bind="$attrs" v-model="currentValue">
      <template v-for="name in currentSlot">
        <slot :name="name" :slot="name"></slot>
      </template>
    </popup>
  </div>
</template>

<script>
import { Popup } from 'vant';
import { getHashCode } from '@/common/utils';

// 跟随路由popup弹窗，返回按钮可关闭
export default {
  name: 'router-popup',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    objKey: {
      type: String,
      default: 'popup'
    }
  },
  components: {
    Popup
  },
  data () {
    return {
      currentSlot: [],
      currentValue: false
    };
  },
  created () {
    this.currentSlot = Object.keys(this.$slots).map(item => item);
    this.currentValue = !!getHashCode(this.objKey);
    if (this.value) {
      this.showPopup();
    }
    // 方法调用，获取不到route时使用hashchange
    if (!this.$route) {
      window.addEventListener('hashchange', () => {
        this.currentValue = !!getHashCode(this.objKey);
      });
    }
  },
  methods: {
    // 渲染popup
    showPopup () {
      if (!getHashCode(this.objKey)) {
        window.location.hash = `${window.location.hash}${/\?/g.test(window.location.hash) ? '&' : '?'}${this.objKey}=1`;
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    next();
  },
  watch: {
    $route () {
      this.currentValue = !!getHashCode(this.objKey);
    },
    currentValue (val) {
      this.$emit('input', val);
    },
    value (val) {
      if (val) this.showPopup();
    }
  }
};
</script>

<style lang="less">
.router-popup {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 200;
}
</style>
