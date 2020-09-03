<template>
  <div class="popup-picker">
    <cell :value-class="{error: !valid}" :title="title" @click="popShow= true" :value="cellValue || placeholder" is-link></cell>
    <popup v-model="popShow" get-container="body" position="bottom">
      <picker :picker-title="pickerTitle" show-toolbar @cancel="onCancel" @confirm="onConfirm" :columns="currentOptions" :value-key="valueKey" :default-index="defaultIndex" />
    </popup>
  </div>
</template>

<script>
import { Popup, Cell, Picker } from 'vant';
import valueMixin from '@/common/mixins/value';
import Bus from '@/common/bus';

export default {
  name: 'popup-picker',
  props: {
    title: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    pickerTitle: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: true
    },
    options: {
      type: Array,
      default: () => []
    },
    // 显示的文本
    valueKey: {
      type: String,
      default: 'value'
    },
    // 取值的文本
    valueType: {
      type: String,
      default: 'key'
    }
  },
  components: {
    Popup, Cell, Picker
  },
  mixins: [valueMixin],
  data () {
    return {
      popShow: false,
      defaultIndex: 0,
      tempValue: null,
      valid: true, // 校验
      errorMessage: ''
    };
  },
  mounted () {
    Bus.$emit('addInput', this);
    this.setTempValue();
  },
  beforeDestroy () {
    Bus.$emit('removeInput', this);
  },
  methods: {
    // picker 只做非空校验
    onValid () {
      if (this.required && !this.currentValue) {
        this.valid = false;
        this.errorMessage = `请选择${this.title || ''}`;
        return;
      }
      this.valid = true;
      this.errorMessage = '';
    },
    focus () {
      this.popShow = true;
    },
    blur () {
      this.onValid();
    },
    onCancel () {
      this.popShow = false;
      this.$emit('onCancel');
    },
    onConfirm (value, index) {
      this.tempValue = value;
      this.popShow = false;
      this.currentValue = typeof value === 'object' ? value[this.valueType] : value;
      this.onValid();
      this.$emit('onConfirm', this.currentValue, index);
    },
    setTempValue () {
      if (!this.value) this.tempValue = '';
      if (this.value && this.currentOptions.length) {
        if (typeof this.currentOptions[0] === 'string') {
          const index = this.currentOptions.indexOf(this.value);
          this.defaultIndex = index >= 0 ? index : 0;
          this.tempValue = this.value;
        } else {
          this.currentOptions.forEach((item, index) => {
            if (item[this.valueType] === this.value) {
              this.defaultIndex = index;
              this.tempValue = item;
              this.currentValue = item[this.valueType];
            }
          });
        }
      }
    }
  },
  watch: {
    popShow (val) {
      val ? this.$emit('show') : this.$emit('hide');
    },
    currentValue (val) {
      this.setTempValue();
      this.$emit('onChange', val);
    },
    options () {
      this.setTempValue();
    }
  },
  computed: {
    cellValue () {
      if (!this.tempValue) return '';
      return typeof this.tempValue === 'object' ? this.tempValue[this.valueKey] : this.tempValue;
    },
    currentOptions () {
      return this.options;
    }
  }
};
</script>

<style lang="less" scope>
.popup-picker {
  position: relative;
  &::after {
    position: absolute;
    box-sizing: border-box;
    content: " ";
    pointer-events: none;
    right: 0;
    left: 30px;
    bottom: 0;
    border-bottom: 1px solid #ebedf0;
    transform: scaleY(0.5);
  }
  &:last-child::after {
    border: none;
  }
}
</style>
