<template>
  <div class="drop-field">
    <field v-bind="$attrs" ref="field" v-on="$listeners" v-model="currentValue" @input="handleChange" @blur="handleBlur" @focus="handleFocus"/>
    <div class="drop-block" v-show="focus&&!lock">
      <div class="drop-block__item" v-for="(item, index) in dropData" :key="index" @click="handleDropClick(item)">
        <div class="label">{{item[objKey]}}</div>
        <div class="label">{{item[objValue]}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { debounce } from '@/common/utils';
import Field from './field.vue';

export default {
  name: 'drop-field',
  props: {
    value: [String, Number],
    dropData: {
      type: Array,
      default: () => []
    },
    objKey: {
      type: String,
      default: 'userName'
    },
    objValue: {
      type: String,
      default: 'phone'
    },
    // 直接弹出
    dorpInit: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Field
  },
  data () {
    return {
      focus: false,
      lock: true,
      currentValue: '',
      st: null
    };
  },
  mounted () {
    this.currentValue = this.value;
  },
  methods: {
    handleDropClick (val) {
      this.lock = true;
      this.$emit('dropClick', val);
      window.clearTimeout(this.st);
    },
    handleChange: debounce(function(val) {
      if (this.lock) return;
      this.$emit('onDrop', { val, next: this.next });
    }, 1000),
    handleFocus () {
      window.clearTimeout(this.st);
      this.lock = false;
      if (this.dorpInit) {
        // this.$emit('onDrop', { this.currentValue, next: this.next });
        this.focus = true;
      }
    },
    handleBlur () {
      // this.$refs.field.onValid();
      window.clearTimeout(this.st);
      this.st = setTimeout(() => {
        this.focus = false;
        this.lock = true;
      }, 300);
    },
    next () {
      this.focus = true;
    },
    blur () {
      this.$refs.field.blur();
    }
  },
  watch: {
    value (val) {
      this.currentValue = val;
    },
    currentValue (val) {
      this.$emit('input', val);
    }
  },
  computed: {
  }
};
</script>

<style lang="less">
.drop-field {
  position: relative;
}
.drop-block {
  position: absolute;
  background: #fff;
  box-shadow: 0 0 16px #ddd;
  right: 20px;
  top: 100%;
  z-index: 10;
  width: 70%;
  max-width: 100%;
  max-height: 300px;
  overflow-y: auto;
  // padding: 10px 0;
  &__item {
    padding: 20px 30px;
    background: #fff;
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    &:last-child {
      border: none;
    }
    &:active {
      background: #e5e5e5;
    }
    // .label{
    //   flex: 1;
    // }
  }
}
</style>
