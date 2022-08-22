<template>
  <div class="detail">
    <div class="detail--image" :class="{ active: activeImage }" @click="activeImage = !activeImage">
      <img v-lazy="getImage(animaInfo.cover)" :alt="animaInfo.name">
    </div>
    <div class="detail--desc">
      <skeleton title animate :row="4" :loading="!animaInfo.name">
        <p class="name">{{ animaInfo.name }}</p>
        <p class="font-s color-gray van-multi-ellipsis--l2">作者: <span v-html="animaInfo.author"></span></p>
        <p class="status">
          <span class="color-red font-s">{{ animaInfo.status }}</span>
          <span class="font-s color-gray">{{ animaInfo.lastUpdata }}</span>
        </p>
        <p class="color-gray desc" :class="{ 'van-multi-ellipsis--l3': activeText }" @click="activeText = !activeText">{{ animaInfo.desc.trim() }}</p>
      </skeleton>
    </div>
    <div class="detail--chapter">
      <p class="title">
        <span>全部章节</span>
        <span class="sort" v-show="chapterList.length">
          <rx-icon icon="icon-order-left sort-cion" :class="{ transform: sort }" @click="handleSort" />
        </span>
      </p>
      <skeleton animate :row="3" :loading="!chapterList.length">
        <div class="grid-chapter">
          <div class="chapter-item" v-for="(item, index) in chapterLimit" :key="index">
            <div :class="{ active: getName(last_chapter_name) === item }" class="chapter-name van-ellipsis" @click="handleRead(item)">{{ item }}</div>
          </div>
        </div>
      </skeleton>
    </div>
    <div class="detail--padding-block"></div>
    <div class="detail--fotter">
      <div class="record" @click="handleRecord(2)">
        <loading v-if="recordLoading" :size="16" />
        <template v-else>
          <rx-icon :icon="!isRecord ? 'icon-guanzhu' : 'icon-shoucang1'" />
          {{ !isRecord ? '追漫' : '已追' }}
        </template>
      </div>
      <div class="detail--source">
        <loading v-if="recordLoading" :size="16" />
        <checkbox v-else class="check" v-model="source" shape="square" @change="onSourceChange"><span>切换源</span>
          <van-icon name="question" size="0.4rem" @click.stop="showTip" />
        </checkbox>

      </div>
      <div class="read-button g-blue" v-ripple @click="handleRead(last_chapter_name)">
        <loading v-if="recordLoading" :size="16" />
        <template v-else>
          {{ !last_chapter_name || last_chapter_name === '未看' ? '开始阅读' : '续看(' + last_chapter_name + ')' }}
        </template>
      </div>
    </div>
    <popup v-model="popupShow" closeable close-on-popstate safe-area-inset-bottom position="bottom" :style="{ height: '60%' }">
      <div class="all-chapter">
        <h3 class="title">全部章节</h3>
        <div class="grid-chapter">
          <div class="chapter-item" v-for="(item, index) in chapterList" :key="index">
            <div :class="{ active: getName(last_chapter_name) === item }" class="chapter-name van-ellipsis" @click="handleRead(item)">{{ item }}</div>
          </div>
        </div>
      </div>
    </popup>
  </div>
</template>

<script>
import { Skeleton, Loading, Popup, Checkbox } from 'vant';
import { changeTitle, rxLocalStorage } from '@/common/utils';

export default {
  name: 'Detail',
  components: {
    Skeleton, Loading, Popup, Checkbox
  },
  data() {
    return {
      source: false,
      sort: false, // false正序 true倒序
      loading: false,
      last_chapter: '', // 历史索引
      last_chapter_name: '', // 当前话
      activeImage: false,
      activeText: true,
      animaInfo: {
        desc: ''
      },
      chapterList: [],
      isRecord: false,
      recordLoading: true,
      popupShow: false // 章节列表
    };
  },
  async mounted() {
    if (!this.id) return;
    await this.getDetail();
    await this.getRecord();
    await this.handleRecord();
    this.addKeepAlive('Detail');
    changeTitle(this.animaInfo.name || '详情');
    this.init();
  },
  activated() {
    this.init();
  },
  methods: {
    init() {
      if (rxLocalStorage.getItem(`source_${this.id}`)) {
        this.source = rxLocalStorage.getItem(`source_${this.id}`) === '1';
      }
      if (rxLocalStorage.getItem(this.id)) {
        const history = JSON.parse(rxLocalStorage.getItem(this.id));
        this.last_chapter_name = history.chapterName;
      }
    },
    onSourceChange(val) {
      const value = val ? 1 : 0;
      rxLocalStorage.setItem(`source_${this.id}`, value);
    },
    showTip() {
      this.$dialog.alert({
        title: '提示',
        theme: 'round-button',
        message: '部分新漫画和其它漫画的解析方式不同，如果加载不出来图片或者页码异常请点击切换加载方式'
      });
    },
    // 获取记录
    async getRecord() {
      const res = await this.$model.getRecord({ manhua: this.id, st: new Date().getTime(), hideToast: 1 });
      if (!res.state) return;
      this.isRecord = res.data.isShow;
      this.last_chapter_name = res.data.last_chapter_name;
      this.last_chapter = res.data.last_chapter;
    },
    // 订阅
    async handleRecord(state = 1) {
      if (!this.chapterList.length) return;
      const data = {
        manhua: this.id,
        state,
        cover: this.animaInfo.cover,
        name: this.animaInfo.name,
        st: new Date().getTime()
      };
      const res = await this.$model.collect(data, { loading: false });
      this.recordLoading = false;
      if (!res.state) return;
      this.isRecord = res.data;
    },
    // 点击章节
    handleRead(val = this.last_chapter_name) {
      if (!this.chapterList.length) return;
      if (val === '...') {
        this.popupShow = true;
        return;
      }
      this.last_chapter_name = val;
      const active = val === '未看' || !val ? (this.sort ? this.chapterLimit[this.chapterLimit.length - 1] : this.chapterLimit[0]) : val;
      this.$router.push(`/reader/${this.id}?chapter=${active}&chs=${this.animaInfo.chapter}&source=${this.source ? 1 : 0}`);
    },
    // 排序
    handleSort() {
      this.sort = !this.sort;
      this.chapterList = this.chapterList.reverse();
    },
    async getDetail() {
      const res = await this.$model.detail({ id: parseInt(this.id, 10) });
      if (!res.state) return;
      this.animaInfo = res.data.animaInfo;
      this.chapterList = res.data.chapterList;
    },
    getName(val) {
      return !val || val === '未看' ? -1 : val;
    }
  },
  watch: {
  },
  beforeRouteLeave(to, from, next) {
    if (!/reader/.test(to.path)) {
      this.removeKeepAlive('Detail');
    }
    next();
  },
  computed: {
    id() {
      return this.$route.params.id;
    },
    chapterLimit() {
      if (!this.chapterList.length) return [];
      const chapter = [];
      chapter.push(...this.chapterList.slice(0, 10));
      if (this.chapterList.length > 12) {
        chapter.push('...');
        chapter.push(this.chapterList[this.chapterList.length - 1]);
      }
      return chapter;
    }
  }
};
</script>

<style lang="less">
.detail {
  overflow-y: auto;
  height: 100%;
  background: #fff;

  .van-skeleton {
    padding: 0;
  }

  &--image {
    width: 100%;
    max-height: 400px;
    min-height: 400px;
    overflow: hidden;
    background: #000;
    transition: all 0.3s;

    &.active {
      max-height: 2000px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      margin: 0 auto;
    }
  }

  &--desc {
    padding: 20px 30px 15px 30px;
    background-color: #fff;

    p.name {
      margin-bottom: 10px;
    }

    p {
      margin-bottom: 5px;
    }

    p.desc {
      font-size: 11px;
    }

    .status {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
    }
  }

  &--chapter {
    padding: 15px 30px;
    background-color: #fff;

    .title {
      margin-bottom: 15px;
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      overflow: hidden;
    }

    .sort-cion {
      transition: all 0.3s;
      display: inline-block;

      &.transform {
        transform: rotate(180deg);
      }
    }
  }

  &--padding-block {
    padding-bottom: 120px;
  }

  &--fotter {
    width: 100%;
    height: 100px;
    background: #fff;
    box-shadow: 0 0 16px #eee;
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 10;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
    padding: 0 50px;

    .record {
      font-size: 14px;
    }

    .rx-icon {
      font-size: 16px;
      margin-right: 10px;
    }

    .icon-shoucang1 {
      color: #f7b934;
    }

    .read-button {
      border-radius: 50px;
      padding: 20px 0;
      width: 280px;
      text-align: center;
      color: #fff;
      font-size: 12px;
    }
  }
}

.grid-chapter {
  display: grid;
  grid-template-columns: repeat(4, 25%);
}

.chapter-item {
  padding: 10px;
}

.chapter-name {
  text-align: center;
  // padding:  0;
  height: 75px;
  line-height: 75px;
  font-size: 12px;
  border-radius: 8px;
  border: 1px solid #e5e5e5;

  &.active {
    color: #0ecef0;
    border-color: #0ecef0;
    border-width: 2px;
  }
}

.all-chapter {
  width: 100%;
  height: 100%;
  display: flex;
  flex-flow: column;
  overflow: hidden;

  .title {
    text-align: center;
    padding: 30px 30px;
    box-shadow: 0 0 16px #eee;
  }

  .grid-chapter {
    padding: 30px !important;
    flex: 1;
    height: 1px;
    overflow-y: auto;
    padding: 15px 0;
  }
}
</style>
