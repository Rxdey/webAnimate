<template>
  <div class="home">
    <div class="tab-block">
      <van-tabs class="full-screen-tab" v-model="active" sticky animated swipeable color="#333" :line-width="20" :line-height="2">
        <van-tab v-for="(tab, index) in tabs" :key="index" :title="tab.title">
          <van-pull-refresh class="scroll-list" v-model="reloading" @refresh="onRefresh" pulling-text="⚡" loosing-text="⚡" success-text="✔">
            <van-list ref="list" v-model="tab.loading" :finished="tab.finished" finished-text="" @load="getData">
              <div class="grid">
                <template v-for="(card, index) in tab.list">
                  <animate-card :data="card" :url="`/detail/${card.manhua}`" :key="index"></animate-card>
                </template>
              </div>
            </van-list>
          </van-pull-refresh>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>

<script>
import AnimateCard from '@/components/animate-card/animate-card.vue';

export default {
  name: 'Home',
  props: {
  },
  components: {
    AnimateCard
  },
  data () {
    return {
      active: 0,
      pageSize: 15,
      reloading: false,
      tabs: [
        { title: '订阅', type: 0, list: [], loading: false, finished: false, pageNo: 1, index: 0 },
        { title: '历史', type: 1, list: [], loading: false, finished: false, pageNo: 1, index: 1 }
      ]
    };
  },
  mounted () {
  },
  methods: {
    async onRefresh () {
      const currentTab = this.tabs[this.active];
      this.tabs[this.active].pageNo = 1;
      const { type } = currentTab;
      const active = this.tabs.map(item => item.type).indexOf(type);
      await this.getData(() => {
        this.tabs[active].list = [];
      });
      setTimeout(() => {
        this.reloading = false;
      }, 500);
    },
    async getData (cb = () => { }) {
      console.log('load');
      const currentTab = this.tabs[this.active];
      const { pageNo, type } = currentTab;
      const active = this.tabs.map(item => item.type).indexOf(type);
      const data = {
        pageNo,
        pageSize: this.pageSize,
        type,
        st: new Date().getTime()
      };
      const res = await this.$model.save(data);
      this.tabs[active].loading = false;
      if (!res.state) {
        this.tabs[active].finished = true;
        return;
      }
      cb();
      this.tabs[active].list.push(...res.data);
      this.tabs[active].finished = res.data.length < this.pageSize;
      this.tabs[active].pageNo += 1;
    }
  },
  watch: {
  },
  computed: {
  }
};
</script>

<style lang="less">
.home {
  background: #fff;
  .tab-block {
    height: 100%;
  }
  .van-tabs__wrap::after {
    border: none;
  }
  .van-tab--active {
    .van-tab__text {
      color: #333;
      font-weight: 700;
      font-size: 16px;
    }
  }
  .van-tab__text {
    font-size: 14px;
    color: #999;
  }
  .van-sticky {
    background: #fff;
    padding-bottom: 20px;
  }
  .van-tabs__nav {
    width: 50%;
    margin: 0 auto;
  }
  .grid {
    display: grid;
    padding: 10px 15px 30px 15px;
    grid-template-columns: repeat(3, 33.33%);
  }
  .van-pull-refresh__track{
    height: 100%;
  }
}
</style>
