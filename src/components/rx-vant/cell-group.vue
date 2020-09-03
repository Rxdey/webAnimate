<template>
  <div class="rx-cell-group">
    <cell-group v-bind="$attrs">
      <slot name="title"></slot>
      <slot></slot>
    </cell-group>
  </div>
</template>

<script>
import { CellGroup } from 'vant';
import Bus from '@/common/bus';

export default {
  name: 'RxCellGroup',
  props: {
    type: {
      type: String,
      default: 'cell'
    }
  },
  components: {
    CellGroup
  },
  data () {
    return {
      fields: [],
      errors: []
    };
  },
  created () {
    Bus.$on('addInput', item => {
      if (!this.fields.includes(item) && this.findParentId(item) === this._uid) {
        this.fields.push(item);
      }
    });
    Bus.$on('removeInput', item => {
      const i = this.fields.indexOf(item);
      if (i !== -1) {
        this.fields.splice(i, 1);
      }
    });
  },
  beforeDestroy () {
    this.fields = [];
    this.errors = [];
  },
  methods: {
    validData ({ callback = () => { }, scroller = 'body' } = {}) {
      let valid = true;
      let count = 0;
      return new Promise(resolve => {
        if (!this.fields.length) {
          resolve(valid);
          callback(valid, 0);
        }
        this.fields.map(item => {
          this.validInput(item);
          if (typeof callback === 'function' && ++count === this.fields.length) {
            valid = !this.errors.length;
            if (this.errors.length) {
              this.scrollerToChild(scroller, this.errors[0].$el);
              if (typeof this.errors[0].focus === 'function') this.errors[0].focus();
              this.$toast({
                position: 'top',
                // className: 'error',
                message: this.errors[0].errorMessage
              });
              this.errors = [];
            }
            resolve(valid);
            callback(valid, item);
          }
        });
      });
    },
    // 表单内容校验
    validInput (item) {
      item.blur();
      const i = this.errors.indexOf(item);
      if (!item.valid) {
        this.errors.push(item);
      } else if (item.valid && i >= 0) {
        this.errors.splice(i, 1);
      }
    },
    // 滚动到第一个未通过校验的元素位置
    scrollerToChild (scroller = 'body', node) {
      scroller = document.querySelector(scroller);
      const offsetTop = this.$el.offsetTop + node.offsetTop - node.offsetTop;
      scroller.scrollTop = offsetTop;
    },
    reset () {
      this.fields.map(item => {
        item.reset();
      });
    },
    findParentId (child) {
      if (!child.$parent) {
        return false;
      }
      if (child.$parent.$options._componentTag === this.$options._componentTag) {
        return child.$parent._uid;
      }
      return this.findParentId(child.$parent);
    }
  },
  watch: {
  },
  computed: {
  }
};
</script>

<style lang="less">
</style>
