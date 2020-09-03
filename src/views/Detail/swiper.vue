<template>
  <div class="rx-swiper" @click.stop="$emit('click')">
    <div class="swiper-container full">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="item in virtualData.slides" :key="item.url" :style="{ left: `${virtualData.offset}px` }">
          <image-card :data="item"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper';
import 'swiper/css/swiper.min.css';
import ImageCard from './image-card.vue';

export default {
  name: 'swiper',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    prviewCount: {
      type: Number,
      default: 3
    },
    direction: {
      type: Number,
      default: 0 // 方向 0 horizontal 1 vertical 2 horizontal 反向
    },
    active: {
      type: Number,
      default: 0 // 初始化位置
    }
  },
  components: {
    ImageCard
  },
  data () {
    return {
      currentName: '',
      mySwiper: null,
      chaperDetail: [],
      virtualData: []
    };
  },
  mounted () {
    this.currentActive = this.active;
    this.chaperDetail = JSON.parse(JSON.stringify(this.list));
    const direction = this.setDirection(this.direction);
    // 初始化swiper
    const self = this;
    this.mySwiper = new Swiper('.swiper-container', {
      direction,
      zoom: true,
      virtual: {
        slides: this.chaperDetail,
        addSlidesBefore: this.prviewCount,
        addSlidesAfter: this.prviewCount,
        observer: true,
        observeParents: true,
        renderExternal: (data) => {
          this.virtualData = data;
        }
      },
      on: {
        init () {
          this.slideTo(self.currentActive, 0);
          if (self.currentActive === 0) {
            let active = this.activeIndex;
            if (self.direction === 2) {
              active = self.chaperDetail.length - 1 - this.activeIndex;
            }
            self.$emit('change', self.chaperDetail[this.activeIndex], active);
          }
        },
        slideChange () {
          self.currentActive = this.activeIndex;
          let active = this.activeIndex;
          if (self.direction === 2) {
            active = self.chaperDetail.length - 1 - this.activeIndex;
          }
          self.$emit('change', self.chaperDetail[this.activeIndex], active);
        }
      }
    });
  },
  methods: {
    setDirection (direction) {
      if (!direction) return 'horizontal';
      if (direction === 1) return 'vertical';
      if (direction === 2) {
        this.chaperDetail = this.chaperDetail.reverse();
        this.currentActive = this.chaperDetail.length - 1 - this.currentActive;
        return 'horizontal';
      }
    },
    updateVirtual () {
      this.mySwiper.virtual.update();
    },
    update () {
      this.mySwiper.update();
    },
    swiperTo (index = 0) {
      this.mySwiper.slideTo(index, 0);
    }
  },
  watch: {
  },
  computed: {

  }
};
</script>

<style lang="less" scope>
.full {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.rx-swiper {
  position: relative;
  .full;
  color: #8d8d8d;
  background-color: #242424;
}
</style>
