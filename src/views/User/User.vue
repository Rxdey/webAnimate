<template>
  <div class="user">
    <div class="user--info" v-ripple>
      <div class="user-head">
        <img v-lazy="'/img/icons/icon.png'" alt="headimage">
      </div>
      <div class="user-name">不想施工了！</div>
    </div>
    <div class="user--list">
      <van-cell-group>
        <van-cell title="啥也没有" is-link />
        <div class="cell-padding"></div>
        <van-cell title="退出登录" is-link @click="handleLogout" />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
import { rxLocalStorage } from '@/common/utils';

export default {
  name: 'User',
  components: {
  },
  data () {
    return {
    };
  },
  mounted () {
  },
  methods: {
    async handleLogout () {
      try {
        await this.$dialog.confirm({
          title: '提示',
          message: '确定要退出吗？'
        });
        rxLocalStorage.clear();
        this.removeKeepAlive('Home,Find,Detail,User');
        this.$toast('已退出');
        window.location.href = `${window.location.origin + window.location.pathname}?st=${new Date().getTime()}#/login`;
      } catch (error) {
        console.log(error);
      }
    }
  },
  watch: {
  },
  computed: {
  }
};
</script>

<style lang="less">
.user {
  &--info {
    background: #fff;
    padding: 30px;
    box-shadow: 0 0 16px #eee;
    text-align: center;
    margin-bottom: 15px;
    .user-head {
      width: 150px;
      height: 150px;
      overflow: hidden;
      border-radius: 180px;
      margin: 0 auto;
      box-shadow: 0 0 16px #eee;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .user-name {
      margin: 30px 0 15px 0;
    }
  }
  .cell-padding {
    padding-bottom: 15px;
    background: #f7f8fa;
  }
}
</style>
