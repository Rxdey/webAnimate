<template>
  <div class="tab-list">
    <ul ref="tab">
      <li class="tab-item" :class="{active: active === index, disabled: item.disabled}" v-for="(item, index) in tabList" :key="index" @click="tabActive(index, item)">
        <div class="tab-content">{{item.label}}</div>
      </li>
    </ul>
    <div class="slide-bar" :style="{ width: sliderWidth + 'px', left: sliderLeft }">
      <span class="slide-line" :style="{ width: sliderBarWidth }"></span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'simple-tab',
  props: {
    tabList: {
      type: Array,
      default: () => []
    },
    value: [Number],
    sliderBarWidth: {
      type: String,
      default: '30px'
    }
  },
  data () {
    return {
      sliderWidth: 0,
      sliderLeft: 0,
      active: 0
    };
  },
  mounted () {
    this.active = this.value;
    this.sliderWidth = this.$refs.tab.clientWidth / this.tabList.length;
    this.sliderLeft = `${this.sliderWidth * this.active}px`;
  },
  watch: {
    value (val) {
      this.active = val;
    },
    active (val) {
      this.$emit('input', val);
      const left = `${this.sliderWidth * val}px`;
      this.sliderLeft = left;
    }
  },
  methods: {
    tabActive (key, data) {
      if (data.disabled) return;
      this.active = key;
      this.$emit('change', key);
    }
  }
};
</script>

<style lang="less">
.tab-list {
  height: 90px;
  line-height: 90px;
  background: #fff;
  position: relative;
  font-size: 14px;
  ul {
    display: flex;
    flex-flow: row;
    .tab-item {
      flex: 1;
      font-size: 14px;
      color: #333;
      height: 100%;
      text-align: center;
      &.disabled {
        color: #ddd;
      }
      &.active {
        color: #068b04;
      }
      .tab-content {
        text-align: center;
        display: inline-block;
      }
    }
  }
  .slide-bar {
    position: absolute;
    left: 0;
    transition: 0.3s all;
    bottom: 0;
    .slide-line {
      display: block;
      background-color: #04be02; // width: 100px;
      height: 6px;
      margin: 0 auto;
    }
  }
}
</style>
