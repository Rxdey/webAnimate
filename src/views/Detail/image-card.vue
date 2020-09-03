<template>
  <div class="image-block swiper-zoom-container">
    <p class="index" v-if="loading || error">{{data.index}}</p>
    <img v-if="!error && !loading" :src="proxy ? getImage(data.url) :data.url" alt="">
    <div class="load-error tap" v-if="error" @click="reload">
      <p class="retry">
        <loading v-if="errorLoading" size="18" />
        <span v-else>
          点击重试?
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import { Loading } from 'vant';
import { rxLocalStorage } from '@/common/utils';

export default {
  name: 'image-card',
  props: {
    data: {
      type: Object,
      default: () => ({})
    }
  },
  components: {
    Loading
  },
  data () {
    return {
      loading: true, // 图片加载状态
      error: false, // 图片加载失败
      errorLoading: false,
      timeOut: null,
      proxy: false
    };
  },
  mounted () {
    this.proxy = rxLocalStorage.getItem('proxy') === '1' || false;
    this.loadingImage(this.data.url);
  },
  methods: {
    reload () {
      if (this.errorLoading) return;
      this.errorLoading = true;
      this.loadingImage(this.data.url);
    },
    loadingImage (url) {
      const img = new Image();
      img.src = this.proxy ? this.getImage(url) : url;
      this.timeOut = setTimeout(() => {
        this.error = true;
      }, 20000);
      img.onload = () => {
        this.loading = false;
        this.error = false;
        this.errorLoading = false;
        window.clearTimeout(this.timeOut);
      };
      img.onerror = () => {
        this.error = true;
        this.errorLoading = false;
        console.log('load error');
      };
    }
  },
  beforeDestroy () {
    window.clearTimeout(this.timeOut);
  },
  watch: {
  },
  computed: {
  }
};
</script>

<style lang="less">
.image-block {
  text-align: center;
  height: 100%;
  display: flex;
  flex-flow: column;
  justify-content: center;
  // align-items: center;
  p.index {
    font-size: 80px;
    margin-bottom: 15px;
  }
  .load-error {
    // font-size: 16px;
    .retry {
      display: inline-block;
      // border: 1px solid #8d8d8d;
      // border-radius: 8px;
      width: 150px;
      height: 70px;
      line-height: 70px;
      text-align: center;
    }
  }
}
</style>
