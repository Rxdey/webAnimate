<template>
  <div class="find">
    <div class="search-block">
      <search v-model="search" @onSearch="onSearch" @change="onChange"/>
    </div>
    <div class="history" v-if="history.length && !isSearch">
      <p class="label font-s color-gray">
        <span>搜索记录</span>
        <rx-icon class="clear" icon="icon-shanchu" @click="handleClear" />
      </p>
      <div class="history--list">
        <span class="history__child tap font-s" v-for="(item, index) in history" :key="index" @click="onSearch(item)">{{item}}</span>
      </div>
    </div>
    <div class="search-result" v-if="isSearch" v-loading="loading">
      <vertical-card v-for="(card, index) in searchResult" :key="index" :data="card" :url="`/detail/${card.id}`"/>
    </div>
  </div>
</template>

<script>
import { Search } from '@/components';
import VerticalCard from '@/components/animate-card/vertical.vue';
import { rxLocalStorage } from '@/common/utils';

export default {
  name: 'Find',
  components: {
    Search, VerticalCard
  },
  data () {
    return {
      search: '',
      history: [],
      searchResult: [],
      loading: false,
      isSearch: false
    };
  },
  created () {
  },
  mounted () {
    this.history = rxLocalStorage.getItem('history') ? JSON.parse(rxLocalStorage.getItem('history')) : [];
  },
  methods: {
    onChange(val) {
      if (!val) {
        this.searchResult = [];
        this.isSearch = false;
      }
    },
    async onSearch (val) {
      if (!val) return;
      this.isSearch = true;
      this.search = val;
      if (!this.history.includes(val)) {
        this.history.unshift(val);
        rxLocalStorage.setItem('history', JSON.stringify(this.history));
      }
      const data = {
        start: val,
        st: new Date().getTime()
      };
      this.loading = true;
      const res = await this.$model.search(data);
      this.loading = false;
      if (!res.state) return;
      this.searchResult = res.data;
    },
    handleClear() {
      rxLocalStorage.removeItem('history');
      this.history = [];
    }
  },
  watch: {
  },
  computed: {
  }
};
</script>

<style lang="less">
.find {
  background: #fff;
  display: flex;
  flex-flow: column;
}
.search-block {
}
.history {
  flex: 1;
  height: 1px;
  overflow-y: auto;
  padding: 30px;
  &--list {
    padding: 20px 0;
    display: flex;
    flex-flow: row wrap;
  }
  &__child {
    background: #f1f1f1;
    border-radius: 4px;
    padding: 5px 15px;
    margin: 5px 10px 5px 0;
    cursor: pointer;
  }
  .label {
    position: relative;
  }
  .clear{
    position: absolute;
    right: 0;
    top: 0;
    font-size: 14px;
  }
}
.search-result {
  flex: 1;
  height: 1px;
  overflow-y: auto;
  padding: 30px;
  background: #fff;
}
</style>
