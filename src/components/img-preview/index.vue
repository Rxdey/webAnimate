<template>
  <transition name="fade">
    <div v-if="show" class="img-preview" :class="{center: center}" @scroll="getImageIndex" ref="scroller">
      <div class="img-preview__close" @click="handleClose">
        <van-icon name="cross" />
      </div>
      <div class="img-preview__image" v-for="(item, index) in imageList" :key="index">
        <img v-lazy="item" alt="">
      </div>
      <div class="page-size">
        <span>{{active}}</span>
        <span> / {{imageList.length}}</span>
      </div>
    </div>
  </transition>
</template>

<script>

export default {
  name: 'img-preview',
  data () {
    return {
      show: false,
      imageList: {
        type: Array,
        default: () => []
      },
      active: 1,
      center: false,
      onClose: () => {}
    };
  },
  mounted () {
    window.addEventListener('hashchange', this.onhashChange);
  },
  methods: {
    onhashChange () {
      window.releaseEvents('hashchange', this.onhashChange);
      this.show = false;
    },
    handleClose () {
      this.show = false;
      this.onClose();
    },
    getImageIndex (e) {
      const imgListEL = document.querySelectorAll('.img-preview__image');
      const targetTop = e.target.scrollTop;
      if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) {
        this.active = this.imageList.length;
        return;
      }
      Array.from(imgListEL).map((item, index) => {
        const pos = item.offsetTop;
        const height = item.offsetHeight;
        if (targetTop >= pos && targetTop <= pos + height) {
          this.active = index + 1;
        }
      });
    }
  }
};
</script>

<style lang="less" scope>
@import url("../../assets/css/animate.less");
.img-preview {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  overflow-y: auto;
  // flex-flow: row wrap;
  // justify-content: flex-start;
  &.center {
    display: flex;
    flex-flow: column;
    justify-content: center;
  }
  &__close {
    position: fixed;
    width: 80px;
    height: 80px;
    text-align: center;
    line-height: 80px;
    top: 0;
    right: 0;
    color: #fff;
    font-size: 32px;
    background: rgba(0, 0, 0, 0.5);
  }
  &__image {
    // height: 100%;
    width: 100%;
    margin-bottom: 10px;
    &:last-child {
      margin: 0;
    }
    img {
      width: 100%;
    }
  }
  .page-size {
    position: fixed;
    bottom: 0;
    right: 0;
    padding: 3px 30px;
    background: #000;
    color: #fff;
    span {
      margin-right: 5px;
      &:last-child {
        margin: 0;
      }
    }
  }
}
</style>
