<template>
  <div class="rx-input" :class="{required: required, 'has-error': !valid}">
    <div class="rx-input__title" v-show="label">
      <div class="rx-input__title--left" v-show="$slots.left">
        <slot name="left"></slot>
      </div>
      <div class="rx-input__title--label"><label :for="inputId">{{label}}</label></div>
    </div>
    <div class="rx-input__body">
      <input :type="type" :id="inputId" @blur="onBlur" :placeholder="placeholder" :maxlength="max" :name="name" v-model="currentValue" :disabled="disabled" :readonly="readonly" ref="input" @input="change" @keyup.enter="entry">
    </div>
    <div class="rx-input__right" v-if="$slots['right']">
      <slot name="right"></slot>
    </div>
    <div class="rx-input__right right-text" v-if="rightText">
      {{rightText}}
    </div>
    <div class="error-message">
      {{errorMessage}}
    </div>
  </div>
</template>

<script>
import { random } from '@/common/utils';
import { mobileReg } from '@/common/utils/rules';
import Bus from '@/common/bus';

const validate = (type, value) => {
  const valids = {
    phone: (val) => ({ valid: mobileReg.test(val), message: '请输入正确的手机号' }),
    number: (val) => ({ valid: /^[0-9]+$/.test(val), message: '请输入数字' })
    // noChinese: (val) => ({ valid: noChinese.test(val), message: '请输入数字或字母' })
  };
  return valids[type](value);
};
// 带校验表单组件 需配合group使用
export default {
  name: 'rx-input',
  props: {
    label: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    max: {
      type: Number,
      default: 1000
    },
    min: {
      type: Number,
      default: 0
    },
    minNumber: {
      type: Number,
      default: 0
    },
    maxNumber: {
      type: Number,
      default: 0
    },
    required: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    value: [String, Number],
    isType: [Function, String],
    'right-text': {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      currentValue: null,
      isFocus: false,
      valid: true,
      errorMessage: null,
      inputId: random(5)
    };
  },
  mounted () {
    this.currentValue = this.value;
    Bus.$emit('addInput', this);
  },
  beforeDestroy () {
    Bus.$emit('removeInput', this);
  },
  watch: {
    currentValue (val) {
      this.$emit('input', val);
    },
    value (val) {
      this.currentValue = val;
    }
  },
  methods: {
    reset () {
      this.currentValue = '';
      this.valid = true;
    },
    focus () {
      this.$refs.input.focus();
      this.isFocus = true;
      this.$emit('onFocus', this.currentValue);
    },
    blur () {
      this.$refs.input.blur();
      this.isFocus = false;
      // this.$emit('onBlur', this.currentValue);
      this.onValid();
    },
    entry () {
      this.$emit('entry', this.currentValue, this);
    },
    onBlur() {
      this.isFocus = false;
      this.onValid();
      this.$emit('onBlur', this.currentValue, this);
    },
    change () {
      this.onValid();
      this.$emit('onChange', this.currentValue);
    },
    enter () {
      this.$emit('enter', this.currentValue);
    },
    // 表单验证，通过isType传递，内部定义phone(国内手机号)，noChinese(不允许中文输入)，支持自定义函数，返回blooean
    onValid () {
      if (this.required && !this.currentValue) {
        this.valid = false;
        this.errorMessage = `${this.label}不能为空`;
        return false;
      }
      if (this.min && this.currentValue.length < this.min) {
        this.valid = false;
        this.errorMessage = `字符长度不能小于${this.min}个`;
        return false;
      }
      this.valid = true;
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
    }
  }
};
</script>

<style lang="less">
// @import url("../../../assets/css/color.less");
@color-red: #ef4f4f;
.flex-row {
  display: flex;
  flex-flow: row;
  flex-wrap: nowrap;
  align-items: center;
  position: relative;
}
.rx-input {
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
    // left: 100px;
    right: 10px;
    line-height: 1;
  }
  &.has-error {
    color: @color-red;
    input {
      color: @color-red;
    }
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
    padding: 10px 10px;
    input {
      border: 0;
      margin: 0;
      padding: 0;
      width: 100%;
      resize: none;
      display: block;
      color: #323233;
      box-sizing: border-box;
      background-color: transparent;
      outline: none;
      line-height: 30px;
      position: relative;
      text-align: right;
      &::placeholder {
        color: #999;
      }
    }
  }
  &__right {
    position: relative;
    padding-right: 15px;
    &.right-text{
      padding: 10px 15px 10px 0;
    }
    img {
      display: block;
      max-height: 50px;
    }
  }
}
</style>
