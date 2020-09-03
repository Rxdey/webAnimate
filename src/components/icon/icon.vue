<template>
  <i class="rx-icon" @click="$emit('click')" :class="icon"></i>
</template>

<script>
export default {
  name: 'RxIcon',
  props: {
    icon: [String]
  }
};
</script>
