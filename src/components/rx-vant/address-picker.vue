<template>
  <div class="address-picker">
    <cell :value-class="{error: !valid}" :title="title" @click="popShow= true" :value="cellValue || placeholder" is-link></cell>
    <popup v-model="popShow" safe-area-inset-bottom get-container="body" position="bottom">
      <rx-address-picker ref="picker" :options="options" :value="defaultValue" @confirm="onConfirm" @cancel="onCancel" :row="row" @ready="onReady"></rx-address-picker>
    </popup>
  </div>
</template>

<script>
import { Popup, Cell } from 'vant';
import valueMixin from '@/common/mixins/value';
import Bus from '@/common/bus';
import RxAddressPicker from '../rx-group/rx-picker/rx-picker.vue';

export default {
  name: 'address-picker',
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
    row: {
      type: Number,
      default: 3
    },
    valueType: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Popup, Cell, RxAddressPicker
  },
  mixins: [valueMixin],
  data () {
    return {
      popShow: false,
      valid: true, // 校验
      errorMessage: '',
      defaultValue: [],
      tempValue: []
    };
  },
  mounted () {
    Bus.$emit('addInput', this);
  },
  beforeDestroy () {
    Bus.$emit('removeInput', this);
  },
  methods: {
    // picker 只做非空校验
    onValid () {
      if (this.required && !this.currentValue.length) {
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
    onReady () {
      this.setTempValue();
    },
    onConfirm (val) {
      this.popShow = false;
      const type = this.valueType ? 'value' : 'name';
      this.currentValue = this.options.filter(item => val.includes(item.value)).map(item => item[type]);
      this.onValid();
      this.$emit('onConfirm', this.currentValue, val);
    },
    onCancel () {
      this.popShow = false;
      this.$emit('onCancel');
    },
    setTempValue () {
      if (this.value.length && this.options.length) {
        // const type = this.valueType ? 'value' : 'name';
        // 选项值为value代码时
        if (this.valueType) {
          this.tempValue = this.value.map(item => this.options.find(n => n.value === item));
        } else {
          // 选项值为中文名称时
          const parent = this.options.filter(item => !item.parent);
          const firstValue = this.currentValue.map((current, index) => (index === 0 ? parent.find(item => item.name === current) : ''));
          this.tempValue = firstValue.map((item, index) => {
            if (index === 0) return item;
            if (index !== 0 && !firstValue[index - 1]) return '';
            const res = this.options.filter(c => (c.parent === firstValue[index - 1].value));
            firstValue[index] = res.find(c => c.name === this.currentValue[index]);
            return firstValue[index];
          });
        }
        this.defaultValue = this.tempValue.map(item => (item ? item.value : ''));
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
      return this.tempValue.length ? this.tempValue.map(item => (item ? item.name : '')).join(' ').trim() : '';
    }
  }
};
</script>

<style lang="less">
</style>
