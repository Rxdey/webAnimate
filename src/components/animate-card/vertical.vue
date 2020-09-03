<template>
  <router-link tag="div" :to="url" class="vertical">
    <div class="vertical--image">
      <img v-lazy="getImage(data.cover)" :alt="data.name">
    </div>
    <div class="vertical--body" v-ripple>
      <p class="name van-multi-ellipsis--l2 color-blue">{{data.name}}</p>
      <p class="author font-s color-gray van-ellipsis">作者:<span v-html="data.author"></span></p>
      <p class="chapter font-s color-red">最新: {{data.chapter}}</p>
      <p class="tag font-s color-gray van-ellipsis">{{data.type.join(' ')}}</p>
      <p class="date font-s color-gray">{{data.date}}</p>
      <p></p>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'vertical',
  props: {
    url: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: () => ({})
    }
  }
};
</script>

<style lang="less">
.vertical {
  display: flex;
  flex-flow: row nowrap;
  margin-bottom: 30px;
  width: 100%;
  cursor: pointer;
  &--image {
    width: 160px;
    height: 220px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
    }
  }
  &--body {
    flex: 1;
    width: 1px;
    padding: 0 30px;
    p {
      margin-bottom: 3px;
    }
  }
}
</style>
