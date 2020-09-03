<template>
  <div class="rx-picker-column" @touchstart="handleTouchStart($event)" @touchmove="handleTouchMove($event)" @touchend="handleTouchEnd($event)">
    <ul ref="wrapper" class="rx-picker-column__wrapper" :style="`line-height:${itemHeight}px;transform: translateY(${transformY}px);transition-duration: ${duration}ms`">
      <template v-for="(item, index) in column">
        <li role="button" :key="index" class="rx-picker-column__item ov" :style="`height:${itemHeight}px`">{{getItem(item)}}</li>
      </template>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'rx-picker-column',
  props: {
    column: {
      type: Array,
      default: () => []
    },
    itemHeight: {
      type: Number,
      default: 44
    },
    valueKey: {
      type: String,
      default: 'name'
    },
    objKey: {
      type: String,
      default: 'value'
    },
    defaultIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      transformY: 0, // 滚动距离
      startY: 0,
      startTime: 0,
      transformStart: 0,
      duration: 0,
      currentIndex: 0,
      tempIndex: 0
    };
  },
  mounted () {
    this.currentIndex = this.defaultIndex;
    this.scrollToIndex(this.currentIndex);
    // this.$refs.wrapper.addEventListener('transitionend', () => {
    //   this.duration = 0;
    //   this.currentIndex = this.tempIndex;
    // });
    this.$emit('ready');
  },
  methods: {
    handleTouchStart (e) {
      this.startY = e.touches[0].clientY;
      this.transformStart = e.touches[0].clientY - this.transformY;
      this.duration = 0;
      this.startTime = new Date().getTime();
    },
    handleTouchMove (e) {
      e.preventDefault();
      if (this.transformY >= this.itemHeight * 3) return;
      if (this.transformY <= -this.itemHeight * (this.column.length - 2)) return;
      this.transformY = e.touches[0].clientY - this.transformStart;
    },
    /**
     * 点击及按下时间小于300毫秒时触发惯性滚动
     * destination 滚动距离 = (速度 / 减速系数) * 方向
     */
    handleTouchEnd (e) {
      const endY = e.changedTouches[0].clientY;
      const nowDate = new Date().getTime();
      const distance = endY - this.startY;
      const speed = Math.abs(distance) / (nowDate - this.startTime);
      const destination = speed / 0.001 * (distance < 0 ? -1 : 1);
      if (nowDate - this.startTime <= 300) {
        this.duration = 1000;
        this.transformY = this.transformY + destination;
      }
      this.feedBack();
    },
    // 滚动回弹
    feedBack () {
      const index = Math.round(((this.itemHeight * 2) - this.transformY) / this.itemHeight);
      // 滚动到最近选项处
      if (index <= this.column.length - 1 && index >= 0) this.currentIndex = index;
      // 顶部回弹
      if (this.transformY <= -this.itemHeight * (this.column.length - 2)) {
        this.currentIndex = this.column.length - 1;
      }
      // 底部回弹
      if (this.transformY >= this.itemHeight * 3) {
        this.currentIndex = 0;
      }
      this.scrollToIndex(this.currentIndex);
    },
    getItem (val) {
      return typeof val === 'string' ? val : val[this.valueKey];
    },
    /**
    * 滚动到指定选项
    * @param {number, array} index 位置
    */
    scrollToIndex (index) {
      if (!this.duration) this.duration = 200;
      this.transformY = (this.itemHeight * 2) - (index * this.itemHeight);
    }
  },
  watch: {
    currentIndex (val) {
      this.$emit('change', { val, data: this.column[val] });
    }
  }
};
</script>

<style lang="less">
</style>
