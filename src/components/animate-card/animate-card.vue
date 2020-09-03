<template>
  <router-link :to="url" tag="div" class="animate-card">
    <div class="animate-card--image">
      <img v-lazy="getImage(data.cover)" alt="">
    </div>
    <div class="animate-card--body">
      <p class="animate-name van-ellipsis">{{data.name}}</p>
      <p class="animate-history color-gray van-ellipsis">
        <span v-if="data.last_chapter_name !== '未看'">看到</span>
        <span>{{data.last_chapter_name}}</span></p>
    </div>
  </router-link>
</template>

<script>
export default {
  name: 'animate-card',
  props: {
    url: {
      type: String,
      default: ''
    },
    data: {
      type: Object,
      default: () => ({
        cover: 'http://app.6comic.com:88/pics/0/7413.jpg',
        create_date: '2019-09-24T06:23:22.000Z',
        id: 22,
        isShow: 1,
        last_chapter: 9,
        last_chapter_name: '22-23話',
        last_page: 0,
        manhua: 7413,
        name: '测试',
        origin: 'unlimit',
        userid: 1
      })
    }
  },
  components: {
  },
  data () {
    return {
    };
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
.animate-card {
  padding: 15px 20px;
  overflow: hidden;
  min-height: 250px;
  &--image {
    border-radius: 8px;
    box-shadow: 0 0 18px 0 #eee;
    overflow: hidden;
    min-height: 250px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  &--body {
    font-size: 14px;
    line-height: 1.5;
    .animate-history {
      font-size: 12px;
    }
  }
}
</style>
