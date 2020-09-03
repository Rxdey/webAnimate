<template>
  <div class="rx-cell" @click="handleCellClick">
    <div class="rx-cell__title">
      <div class="rx-cell__title--left" v-show="$slots.left">
        <slot name="left"></slot>
      </div>
      <div class="rx-cell__title--label">{{label}}</div>
    </div>
    <div class="rx-cell__body">
      <p>{{value}}</p>
      <slot name="body"></slot>
    </div>
    <div class="rx-cell__right" v-show="$slots['right']">
      <!-- <div class="iconfont icon-right"></div> -->
      <slot name="right"></slot>
    </div>
    <div class="error-message">
      <slot name="error"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'rx-cell',
  props: {
    label: {
      type: String,
      default: ''
    },
    value: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
    };
  },
  computed: {
  },
  created () {
  },
  mounted () {
  },
  watch: {
  },
  methods: {
    handleCellClick() {
      this.$emit('click', this.value);
    }
  },
  components: {
  }
};
</script>

<style lang="less">
.flex-row {
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  align-items: center;
  position: relative;
}
.rx-cell {
  position: relative;
  width: 100%;
  font-size: 14px;
  background: #fff;
  box-sizing: border-box;
  line-height: 30px;
  border-bottom: 1px solid #e5e5e5;
  * {
    box-sizing: border-box;
  }
  .error-message {
    display: none;
    color: @color-red;
    font-size: 12px;
    position: absolute;
    bottom: 2px;
    left: 100px;
    line-height: 1;
  }
  &.has-error {
    color: @color-red;
    .error-message {
      display: block;
    }
  }
  &.required {
    &::after {
      content: "*";
      position: absolute;
      color: @color-red;
      top: 59%;
      transform: translateY(-50%);
      left: 5px;
    }
  }
  .flex-row;
  &__title {
    padding: 10px 0 10px 15px;
    .flex-row;
    max-width: 90px;
    flex: 1;
    &--left {
      margin-right: 5px;
    }
  }
  &__body {
    width: 100%;
    flex: 1;
    padding: 10px 0 10px 10px;
  }
  &__right {
    position: relative;
    padding-right: 15px;
    img {
      display: block;
      max-height: 50px;
    }
  }
}
</style>
