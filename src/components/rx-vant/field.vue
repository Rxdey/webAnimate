<template>
  <field v-bind="$attrs" ref="field" @blur="blur" @focus="focus" @clear="clear" @click="click" @click-left-icon="clickLeftIcon" @click-right-icon="clickRightIcon" :error="!valid" @keyup.enter="enter" v-model="currentValue">
    <template v-for="name in currentSlot">
      <slot :name="name" :slot="name"></slot>
    </template>
    <div v-show="!valid" slot="right-icon" class="rx-error" @click="tostError">
      <van-icon name="warning" />
    </div>
  </field>
</template>

<script>
import { field } from 'vant';
import Bus from '@/common/bus';

// isType属性内置项目常用校验
const validate = (type, value) => {
  const valids = {
    number: (val) => ({ valid: /^[0-9]+$/.test(val), message: '请输入数字' }),
    chinaname: val => ({ valid: /^(?:[\u4e00-\u9fa5·]{2,16})$/.test(val), message: '请输入正确的中文姓名' })
  };
  return valids[type](value);
};

export default {
  name: 'RxField',
  components: {
    field
  },
  props: {
    value: [String, Number],
    isType: [Function, String],
    required: {
      type: Boolean,
      default: false
    },
    max: {
      type: Number,
      default: 400
    },
    min: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      valid: true,
      errorMessage: '',
      currentValue: '',
      currentSlot: [],
      isFocus: false
    };
  },
  mounted () {
    Bus.$emit('addInput', this);
    this.currentValue = this.value;
    this.currentSlot = Object.keys(this.$slots).map(item => item);
  },
  beforeDestroy () {
    Bus.$emit('removeInput', this);
  },
  watch: {
    currentValue (val) {
      if (this.isFocus) this.onValid();
      this.$emit('input', val);
    },
    value (val) {
      this.currentValue = val;
    }
  },
  methods: {
    tostError () {
      this.$toast({ message: this.errorMessage, duration: 2000, position: 'top' });
    },
    enter () {
      this.$emit('enter');
    },
    blur (event) {
      this.onValid();
      this.$refs.field.blur();
      this.isFocus = false;
      this.$emit('blur', event);
    },
    focus (event) {
      this.$refs.field.focus();
      this.isFocus = true;
      this.$emit('focus', event);
    },
    clear (event) {
      this.$emit('clear', event);
    },
    click (event) {
      this.$emit('click', event);
    },
    clickLeftIcon (event) {
      this.$emit('click-left-icon', event);
    },
    clickRightIcon (event) {
      this.$emit('click-right-icon', event);
    },
    reset () {
      this.valid = true;
      this.currentValue = '';
    },
    // 表单验证，通过isType传递，支持自定义函数，自定义函数需返回Boolean
    onValid () {
      this.valid = true;
      this.errorMessage = '';
      if (this.required && !this.currentValue) {
        this.valid = false;
        this.errorMessage = `${this.$attrs.label || ''}不能为空`;
        return false;
      }
      if (this.min && this.currentValue.length < this.min) {
        this.valid = false;
        this.errorMessage = `字符长度不能小于${this.min}个`;
        return false;
      }
      if (this.isType === 'number') {
        if (this.currentValue < this.minNumber) {
          this.valid = false;
          this.errorMessage = `不能小于${this.minNumber}`;
          return false;
        }
        if (this.maxNumber && this.currentValue > this.maxNumber) {
          this.valid = false;
          this.errorMessage = `不能大于于${this.maxNumber}`;
          return false;
        }
      }
      if (this.isType) {
        let validFun = null;
        if (typeof this.isType === 'string') {
          validFun = validate(this.isType, this.currentValue);
        } else {
          validFun = this.isType(this.currentValue);
        }
        this.valid = validFun.valid;
        this.errorMessage = validFun.message;
      }
      if (this.valid) this.errorMessage = '';
    }
  },
  computed: {
  }
};
</script>

<style lang="less">
.rx-error {
  color: #f44;
  .van-icon {
    font-size: 18px;
  }
}
</style>
