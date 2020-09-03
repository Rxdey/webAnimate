<template>
  <div class="rx-search-box">
    <div class="rx-search-box__block" :class="{active:isMask}">
      <div class="from-group">
        <input type="search" name="rx-search" class="rx-search" :placeholder="placeholder" ref="serach" @focus="handleFocus" @blur="handleBlur" @keydown.enter="search" v-model="currentValue">
        <i class="rx-icon" :class="icon" @click="search"></i>
      </div>
      <!-- <div class="search-mask" v-show="isMask" @click="handleMaskClick"></div> -->
    </div>
  </div>
</template>
<script>
export default {
  name: 'search',
  props: {
    placeholder: {
      type: String,
      default: '请输入搜索内容...'
    },
    icon: {
      type: String,
      default: 'icon-sousuo'
    },
    value: [String]
  },
  data () {
    return {
      currentValue: '',
      isMask: false
    };
  },
  mounted () {
    this.currentValue = this.value;
  },
  methods: {
    search () {
      this.$emit('onSearch', this.currentValue);
      this.$refs.serach.blur();
    },
    handleFocus () {
      this.isMask = true;
    },
    handleBlur () {
      this.isMask = false;
    }
    // handleMaskClick () { }
  },
  computed: {},
  watch: {
    value(val) {
      this.currentValue = val;
    },
    currentValue(val) {
      this.$emit('input', val);
      this.$emit('change', val);
    }
  },
  components: {}
};
</script>
<style lang="less">
.rx-search-box {
  width: 100%;
  height: 140px;
  box-shadow: 0 0 16px #eee;
  background: #fff;
  box-sizing: border-box;
  &__block {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 30px;
    &.active {
      position: fixed;
      z-index: 100;

      left: 0;
      top: 0;
    }
  }
  .search-mask {
    background: rgba(0, 0, 0, 0.3);
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  .from-group {
    height: 80px;
    color: #333;
    background: #f4f4f4;
    border-radius: 90px;
    box-sizing: border-box;
    padding: 0 45px;
    position: relative;
    z-index: 100;
    .rx-icon {
      position: absolute;
      right: 30px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 16px;
    }
    input[type="search"] {
      -webkit-appearance: none;
    }
    input::-webkit-search-decoration,
    input::-webkit-search-cancel-button {
      display: none;
    }
    .rx-search {
      font-size: 14px;
      width: 100%;
      height: 70px;
      margin-top: 5px;
      padding: 5px 7px;
      box-sizing: border-box;
      outline: none;
      border: none;
      background: #f4f4f4;
      &::placeholder {
        color: #999999;
      }
    }
  }
}
</style>
