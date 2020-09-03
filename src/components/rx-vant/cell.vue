<template>
  <div class="rx-cell">
    <cell v-bind="$attrs">
      <slot name="title"></slot>
      <slot name="label"></slot>
      <slot name="icon"></slot>
      <slot name="right-icon"></slot>
    </cell>
  </div>
</template>

<script>
import { Cell } from 'vant';

export default {
  name: 'RxCell',
  components: {
    Cell
  },
  // props: {},
  data () {
    return {
    };
  },
  created () {
    // console.log(this);
  },
  mounted () {
  },
  methods: {
  },
  watch: {
  },
  computed: {
  }
};
</script>

<style lang="less">
</style>
