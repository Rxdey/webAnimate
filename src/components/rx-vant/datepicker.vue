<template>
  <div class="date-picker">
    <cell v-if="!$slots.label" :title="title" @click="popShow= true" :value="tempValue || placeholder" is-link></cell>
    <div v-else @click="popShow= true">
      <slot name="label"></slot>
    </div>
    <popup v-model="popShow" get-container="body" position="bottom" @opened="handleOpend" @close="handleClose">
      <datetime-picker ref="datetime" v-model="currentValue" :type="type" @confirm="confirm" @cancel="cancel" :min-date="minDate | changeDateType" :max-date="maxDate | changeDateType" />
    </popup>
  </div>
</template>

<script>
import { Popup, DatetimePicker, Cell } from 'vant';
import { dateFormat } from '@/common/utils';
import Bus from '@/common/bus';

export default {
  name: 'datepicker',
  props: {
    value: [Date, String],
    minDate: {
      type: [Date, String],
      default: () => new Date('1980/01/01')
    },
    maxDate: {
      type: [Date, String],
      default: () => new Date()
    },
    defaultShowValue: {
      type: [Date, String],
      default: () => new Date()
    },
    type: {
      type: String,
      default: 'date'
    },
    title: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: '请选择'
    }
  },
  data () {
    return {
      popShow: false,
      currentValue: '',
      tempValue: '',
      formatType: 'YYYY/MM/DD',
      valid: true,
      errorMessage: ''
    };
  },
  mounted () {
    Bus.$emit('addInput', this);
    // 格式转换
    this.tempValue = typeof this.value === 'string' ? this.value : dateFormat(this.value, this.formatType);
    this.currentValue = this.value ? new Date(this.value) : '';
  },
  beforeDestroy () {
    Bus.$emit('removeInput', this);
  },
  watch: {
    type (val, next) {
      next === 'date' ? this.formatType = 'YYYY/MM/DD' : this.formatType;
    },
    value (val) {
      this.currentValue = new Date(val);
      this.tempValue = val;
    },
    tempValue (val) {
      this.$emit('input', val);
      this.$emit('onChange', val);
    },
    popShow (val) {
      val ? this.$emit('show') : this.$emit('hide');
    }
  },
  methods: {
    handleOpend() {
      if (this.defaultShowValue && !this.currentValue) {
        this.currentValue = new Date(this.defaultShowValue);
      }
    },
    handleClose() {
      // console.log('close');
    },
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
    confirm () {
      this.popShow = false;
      this.tempValue = dateFormat(this.currentValue, this.formatType);
      this.$emit('onConfirm', this.tempValue);
    },
    cancel () {
      this.popShow = false;
      this.$emit('onCancel', this.tempValue);
    }
  },
  components: {
    Popup, DatetimePicker, Cell
  },
  filters: {
    dateFormat,
    changeDateType (val) {
      return typeof val === 'string' ? new Date(val) : val;
    }
  }
};
</script>

<style lang="less" scope>
.date-picker {
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
