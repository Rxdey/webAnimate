<template>
  <transition name="slide">
    <div class="rx-notify" :style="{ background: background, color: color }" v-transferDom v-show="currentValue">
      <slot></slot>
    </div>
  </transition>
</template>

<script>
import valueMixins from '@/common/mixins/value';

export default {
  name: 'notify',
  mixins: [valueMixins],
  props: {
    background: {
      type: String,
      default: '#278e42'
    },
    color: {
      type: String,
      default: '#fff'
    },
    duration: {
      type: Number,
      default: 3000
    }
  },
  components: {
  },
  data () {
    return {
    };
  },
  created () {
  },
  mounted () {
  },
  methods: {
  },
  watch: {
  },
  computed: {
  }
};
</script>

<style lang="less" scope>
@import url("../../assets/css/animate.less");
.rx-notify{
  position: fixed;
  top: 0;
  left: 0;
  padding: 12px;
  width: 100%;
  font-size: 14px;
}
</style>
