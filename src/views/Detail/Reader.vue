<template>
  <div class="reader">
    <loading class="re-loading" v-if="!loading" vertical type="spinner">装载中，等一下...</loading>
    <swiper ref="swiper" v-if="loading" :list="list" :direction="direction" :active="active" @change="onChange" @click="showSetting = !showSetting" />
    <div class="tool-bar">
      <span class="set" @click.stop="showSetting = !showSetting">
        <rx-icon icon="icon-shezhi" />
      </span>
      <span>{{changeData.chapterName}}</span>
      <span>{{changeData.index + '/' + changeData.totle}}</span>
      <span>{{date}}</span>
    </div>
    <transition name="slide">
      <div class="setting" v-show="showSetting">
        <div class="setting--bar">
          <div class="title">阅读模式</div>
          <div class="body">
            <span @click="handleChangeDirection(item.tag)" :class="{active: direction === item.tag}" v-for="(item, index) in directionOption" :key="index">{{item.name}}</span>
          </div>
        </div>
        <div class="setting--bar">
          <div class="title">使用代理</div>
          <div class="body">
            <checkbox class="check" v-model="proxy" @change="onProxyChange" shape="square"></checkbox>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { Loading, Checkbox } from 'vant';
import { dateFormat, rxLocalStorage } from '@/common/utils';
import Swiper from './swiper.vue';


export default {
  name: 'Reader',
  components: {
    Swiper, Loading, Checkbox
  },
  data () {
    return {
      loading: false, // 初始化状态 完成后开始装载
      chaperDetail: [], // 全部章节图片列表
      changeData: {
        chapterName: '',
        index: '1',
        totle: '1'
      },
      date: '',
      inv: null,
      active: 0,
      showSetting: false, // 显示工具栏
      direction: 0,
      directionOption: [
        { name: '普通', tag: 0 },
        { name: '日漫', tag: 2 },
        { name: '滚动', tag: 1 }
      ],
      proxy: false
    };
  },
  async mounted () {
    await this.getImageUrl();
    this.getDate();
    this.init();
    this.loading = true;
  },
  methods: {
    init () {
      this.direction = rxLocalStorage.getItem('direction') ? parseInt(rxLocalStorage.getItem('direction'), 10) : 0;
      this.proxy = rxLocalStorage.getItem('proxy') === '1' || false;
      const history = rxLocalStorage.getItem(this.id) ? JSON.parse(rxLocalStorage.getItem(this.id)) : {};
      const chapter = this.$route.query.chapter;
      this.active = history.active || 0;
      // 当前话非继续阅读时，获取当前话的开头
      if (history.chapterName !== chapter) {
        const current = this.list.map(item => item.chapterName).indexOf(chapter);
        this.active = current;
      }
    },
    getDate () {
      this.date = dateFormat(new Date(), 'HH:mm');
      if (this.inv) {
        window.clearInterval(this.inv);
      }
      this.inv = setInterval(() => {
        this.date = dateFormat(new Date(), 'HH:mm');
      }, 1000);
    },
    onChange (data, index) {
      this.changeData = data;
      const history = rxLocalStorage.getItem(this.id) ? JSON.parse(rxLocalStorage.getItem(this.id)) : {};
      if (history.chapterName !== data.chapterName) {
        this.updateRecord();
      }
      rxLocalStorage.setItem(this.id, JSON.stringify({ ...data, active: index }));
    },
    // 获取章节图片
    async getImageUrl () {
      const res = await this.$model.getImageUrl({ id: this.id, ch: 1, chs: this.$route.query.chs, source: this.$route.query.source });
      if (!res.state) {
        this.$dialog.alert({
          title: '提示',
          message: res.msg
        });
        return;
      }
      this.chaperDetail = res.data;
    },
    // 加载代理
    onProxyChange () {
      rxLocalStorage.setItem('proxy', this.proxy ? 1 : 0);
      this.loading = false;
      this.init();
      this.showSetting = false;
      setTimeout(() => {
        this.loading = true;
      }, 1000);
    },
    // 更换阅读模式
    handleChangeDirection (val) {
      this.direction = val;
      rxLocalStorage.setItem('direction', val);
      this.loading = false;
      this.init();
      this.showSetting = false;
      setTimeout(() => {
        this.loading = true;
      }, 1000);
    },
    // 更新记录
    async updateRecord () {
      const data = {
        st: new Date().getTime(),
        manhua: this.id,
        lastChapterName: this.changeData.chapterName,
        lastChapter: this.changeData.chapterIndex,
        lastPage: 0,
        hideToast: 1
      };
      await this.$model.update(data);
      // if (!res.state) return;
    }
  },
  beforeRouteLeave (to, from, next) {
    window.clearInterval(this.inv);
    this.updateRecord();
    next();
  },
  computed: {
    list () {
      return this.chaperDetail.length ? this.chaperDetail.map((item, i) => item.list.map((img, index) => ({
        url: img,
        index: index + 1,
        chapterName: item.chapterName,
        totle: item.totle,
        chapterIndex: i
      }))).reduce((a, b) => a.concat(b)) : [];
    },
    id () {
      return this.$route.params.id;
    }
  }
};
</script>

<style lang="less">
.reader {
  overflow: hidden;
  background-color: #242424;
  .tool-bar {
    background-color: #000;
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 5px 30px 5px 15px;
    color: #fff;
    font-size: 12px;
    z-index: 99;
    span {
      margin: 0 5px;
    }
    .set {
      .rx-icon {
        font-size: 12px;
      }
    }
  }
  .setting {
    position: absolute;
    width: 100%;
    bottom: 0;
    left: 0;
    background-color: #0a101d;
    padding: 30px;
    transition: all 0.3s;
    color: #d4d4d4;
    z-index: 99;
    &--bar {
      display: flex;
      flex-flow: row;
      margin-bottom: 20px;
      &:last-child {
        margin: 0;
      }
      .title {
        width: 150px;
      }
      .body {
        flex: 1;
        padding: 0 30px;
        .check {
          margin: 0 15px;
        }
        span {
          margin: 0 15px;
          padding: 5px 15px;
          border: 1px solid #eee;
          border-radius: 8px;
          &.active {
            border-color: #2c90ee;
            color: #2c90ee;
          }
        }
      }
    }
  }
  .re-loading {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
