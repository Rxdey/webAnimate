<template>
  <router-link tag="div" :to="url" class="vertical">
    <div class="vertical--image">
      <img v-lazy="getImage(data.cover)" :alt="data.name">
      <span class="chapter font-s">{{data.chapter}}</span>
    </div>
    <div class="vertical--body" v-ripple>
      <p class="name van-multi-ellipsis--l2 color-blue">
        <span v-html="changeKeyRed(data.name, keyWord)"></span>
      </p>
      <!-- <p class="author font-s color-gray van-ellipsis">作者:<span v-html="data.author"></span></p> -->
      <!-- <p class="chapter font-s color-red">最新: {{data.chapter}}</p> -->
      <!-- <p class="tag font-s color-gray van-ellipsis">{{data.type.join(' ')}}</p> -->
      <!-- <p class="date font-s color-gray">{{data.date}}</p> -->
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
    keyWord: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    changeKeyRed(str, keyWord) {
      if (str != null && keyWord != null) {
        const substr = new RegExp(keyWord, 'g');
        const replaceStr = str.replace(substr, `<font style='color:#ff4242'>${keyWord}</font>`);
        return replaceStr;
      }
      return str;
    }
  }
};
</script>

<style lang="less">
.vertical {
  // display: flex;
  // flex-flow: row nowrap;
  margin-bottom: 30px;
  width: 50%;
  overflow: hidden;
  cursor: pointer;
  float: left;
  &--image {
    width: 100%;
    padding: 0 10px;
    overflow: hidden;
    position: relative;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
    }
    .chapter {
      position: absolute;
      bottom: 8px;
      right: 10px;
      background: linear-gradient(90deg, fade(#007af5, 0%) 0%, #fa6400fb 100%);
      width: 95%;
      padding: 5px 20px;
      text-align: right;
      color: #fff;
    }
  }
  &--body {
    padding: 0 30px;
    min-height: 80px;
    p {
      margin-bottom: 3px;
    }
  }
}
</style>
