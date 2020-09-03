import rxMask from './rx-mask';

export default {
  props: {
    maskState: true
  },
  watch: {
    mask () {
      this.renderMask();
    },
    value (val) {
      this.show = val;
      this[val ? 'open' : 'close']();
    },
    show (val) {
      this.$emit('input', val);
    }
  },
  mounted () {
    this.show = this.value;
  },
  methods: {
    maskClick () {
      if (this.maskClose) {
        this.show = false;
      }
    },
    open () {
      this.renderMask();
    },
    close () {
      rxMask.close();
      this.$emit('close');
    },
    renderMask () {
      if (this.mask) {
        rxMask.open(this);
      } else {
        rxMask.close();
      }
    }
  }
};
