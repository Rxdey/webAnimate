<template>
  <div class="rx-picker">
    <div class="rx-picker__header rx-after-border" v-show="showToolbar">
      <button type="button" class="rx-picker__confirm" @click="handleCancel">{{cancelTxt}}</button>
      <div class="rx-picker__title">{{toolbarTitle}}</div>
      <button type="button" class="rx-picker__confirm" @click="handleConfirm">{{confirmTxt}}</button>
    </div>
    <div class="rx-picker--columns" :style="{height: height}" v-loading="loading">
      <template v-for="(column, i) in currentOptions">
        <rx-picker-column ref="column" :column="column" :itemHeight="itemHeight" :key="i" :valueKey="valueKey" :objKey="objKey" @change="columnChange($event, i)" @ready="onReady(i)"></rx-picker-column>
      </template>
      <div class="rx-picker__mask" :style="`background-size: 100% ${itemHeight*2}px`"></div>
      <div class="rx-picker__frame rx-after-border" :style="{height: `${itemHeight}px`}"></div>
    </div>
  </div>
</template>

<script>
import RxPickerColumn from './rx-picker-column.vue';

export default {
  name: 'rx-picker',
  props: {
    value: [String, Number, Array],
    height: {
      type: String,
      default: '220px'
    },
    itemHeight: {
      type: Number,
      default: 44
    },
    showToolbar: {
      type: Boolean,
      default: true
    },
    toolbarTitle: {
      type: String,
      default: ''
    },
    confirmTxt: {
      type: String,
      default: '确定'
    },
    cancelTxt: {
      type: String,
      default: '取消'
    },
    options: {
      type: Array,
      default: () => []
    },
    valueKey: {
      type: String,
      default: 'name'
    },
    objKey: {
      type: String,
      default: 'value'
    },
    loading: {
      type: Boolean,
      default: false
    },
    row: {
      type: Number,
      default: 3
    }
  },
  components: {
    RxPickerColumn
  },
  data () {
    return {
      currentValue: ''
    };
  },
  mounted () {
    if (this.value.length < this.row) {
      for (let n = 0; n < this.row; n++) {
        if (n > this.value.length - 1) {
          this.value.push('');
        }
      }
    }
    this.currentValue = this.value;
    this.$nextTick(() => {
      this.initCurrentValue();
      this.$emit('ready');
    });
  },
  methods: {
    onReady (index) {
      this.currentOptions[index].forEach((item, i) => {
        if (item.value === this.currentValue[index]) {
          this.$refs.column[index].scrollToIndex(i);
        }
      });
    },
    handleConfirm () {
      if (this.loading) return false;
      this.$emit('confirm', this.currentValue);
    },
    handleCancel () {
      if (this.loading) return false;
      this.$emit('cancel', this.currentValue);
    },
    setCurrentValue (code = '', i = 0) {
      if (!code) return;
      let currentList = [];
      if (this.currentValue.length) {
        currentList = this.currentValue;
      }
      if (this.currentValue.length < this.row) {
        for (let n = 0; n < this.row; n++) {
          if (n > currentList.length) {
            currentList.push('');
          }
        }
      }
      currentList.forEach((item, index) => {
        if (index < i) return;
        let value = '';
        if (index === i) {
          value = code;
        }
        if (index > i) {
          if (this.currentValue[index - 1] === '') {
            value = '';
          } else {
            const childList = this.options.find(c => c.parent === this.currentValue[index - 1]);
            value = childList ? childList[this.objKey] : '';
          }
        }
        this.$set(this.currentValue, index, value);
      });
    },
    // 选项变更
    columnChange ({ data }, index) {
      this.currentOptions.forEach((item, i) => {
        if (index < i) {
          this.$refs.column[i].scrollToIndex(0);
        }
      });
      this.setCurrentValue(data[this.objKey], index);
    },
    // 根据选项初始化值
    initCurrentValue () {
      if (!this.options.length) return;
      if (typeof this.options[0] !== 'string' && !this.currentValue[0]) {
        const parentList = this.options.find(p => !p.parent);
        if (!parentList) {
          console.warn('数据结构错误，请确认options存在最上级');
          return;
        }
        const value = parentList[this.objKey];
        this.setCurrentValue(value, 0);
      }
    },
    /**
     * { name, value, parent } 格式数据转换为多列数据 这很慢，数据量大还是别用
     * @param {Array} array 原始数据
     * @param {Array} parentList 父元素集合
     * @param {Array} temp 返回集合
     * @returns {Array} 返回temp
     */
    getOptionsArray (array = [], parentList = [], temp = []) {
      let child = [];
      if (!parentList.length) {
        child = array.filter(item => !item.parent);
      } else {
        // value相同的情况下，防止死循环
        child = array.filter(item => parentList.some(n => (n[this.objKey] === item.parent && n[this.objKey] !== item[this.objKey])));
      }
      if (!child.length) return temp;
      temp.push(child);
      return this.getOptionsArray(array, child, temp);
    }
  },
  computed: {
    currentOptions () {
      if (typeof this.options[0] === 'string') {
        return [this.options];
      }
      if (typeof this.options[0] === 'object') {
        return this.currentValue ? this.currentValue.map((item, index) => {
          if (index === 0) return this.options.filter(c => !c.parent);
          if (index !== 0 && !this.currentValue[index - 1]) return [];
          return this.options.filter(c => c.parent === this.currentValue[index - 1]);
        }) : [];
      }
      return this.options;
    }
  },
  watch: {
    options () {
      this.initCurrentValue();
    },
    value (val) {
      this.currentValue = val;
    },
    currentValue (val) {
      this.$emit('input', val);
    }
  }
};
</script>

<style lang="less" scope>
.rx-after-border {
  &::after {
    position: absolute;
    box-sizing: border-box;
    content: " ";
    pointer-events: none;
    top: -50%;
    right: -50%;
    bottom: -50%;
    left: -50%;
    border: 0 solid #ebedf0;
    -webkit-transform: scale(0.5);
    transform: scale(0.5);
  }
}
.rx-picker {
  user-select: none;
  position: relative;
  background-color: #fff;
  &__header {
    display: flex;
    justify-content: space-between;
    height: 44px;
    line-height: 44px;
    position: relative;
    &::after {
      border-bottom-width: 1px;
    }
  }
  &--columns {
    position: relative;
    display: flex;
    flex-flow: row nowrap;
  }
  &-column {
    flex: 1;
    overflow: hidden;
    font-size: 16px;
    text-align: center;
    position: relative;
    &__wrapper {
      transition-timing-function: cubic-bezier(0.23, 1, 0.68, 1);
      transition-duration: transform;
    }
    &__item {
      padding: 0 5px;
      color: #000;
    }
  }
  &__mask {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    background-image: linear-gradient(
        180deg,
        hsla(0, 0%, 100%, 0.9),
        hsla(0, 0%, 100%, 0.4)
      ),
      linear-gradient(0deg, hsla(0, 0%, 100%, 0.9), hsla(0, 0%, 100%, 0.4));
    background-repeat: no-repeat;
    background-position: top, bottom;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    pointer-events: none;
  }
  &__frame {
    position: absolute;
    top: 50%;
    left: 0;
    z-index: 3;
    width: 100%;
    transform: translateY(-50%);
    pointer-events: none;
    &::after {
      border-width: 1px;
    }
  }
  &__confirm {
    padding: 0 16px;
    color: #1989fa;
    font-size: 14px;
    background-color: transparent;
    border: none;
    &:active {
      background-color: #f2f3f5;
    }
  }
}
</style>
