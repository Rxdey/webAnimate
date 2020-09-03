<template>
  <div class="login">
    <nav-bar title="登录" class="login-nav-bar">
      <rx-icon icon="icon-31guanbi" slot="left" @click="$router.back()" />
    </nav-bar>
    <div class="login-block">
      <rx-cell-group ref="group" class="margin">
        <rx-field title="账号" v-model="form.username" placeholder="请输入账号" required />
        <rx-field title="密码" :type="icon.type" v-model="form.password" placeholder="请输入密码" required>
          <van-icon slot="button" class="eye" :name="icon.name" @click="handleShowPassword" />
        </rx-field>
      </rx-cell-group>
      <van-button block type="info" :loading="loading" :disabled="!form.username || !form.password" @click="handleLogin">登录</van-button>
    </div>
  </div>
</template>

<script>
import { NavBar } from 'vant';
import md5 from 'md5';
import { rxLocalStorage } from '@/common/utils';
import { RxField, RxCellGroup } from '@/components/rx-vant';

export default {
  name: 'Login',
  components: {
    NavBar, RxField, RxCellGroup
  },
  data () {
    return {
      loading: false,
      form: {
        username: '',
        password: ''
      },
      icon: { name: 'eye-o', type: 'password' }
    };
  },
  created () {
  },
  mounted () {
  },
  methods: {
    async handleLogin() {
      const data = {
        username: this.form.username.trim(),
        password: md5(this.form.password.trim()),
        st: new Date().getTime()
      };
      this.loading = true;
      const res = await this.$model.login(data);
      this.loading = false;
      if (!res.state) return;
      // console.log(res);
      this.$toast('登录成功');
      rxLocalStorage.setItem('username', this.form.username);
      rxLocalStorage.setItem('userId', res.data[0].id);
      this.loading = true;
      window.location.href = `${window.location.origin + window.location.pathname}?st=${new Date().getTime()}#/home`;
    },
    handleShowPassword () {
      this.icon.name = this.icon.name === 'eye-o' ? 'closed-eye' : 'eye-o';
      this.icon.type = this.icon.type === 'text' ? 'password' : 'text';
    }
  },
  watch: {
  },
  computed: {
  }
};
</script>

<style lang="less">
.login{
  background: #fff;
}
.login-nav-bar {
  .van-nav-bar__title {
    color: #666;
  }
  .icon-31guanbi {
    color: #999;
    font-size: 16px;
  }
}
.login-block {
  padding: 50px 30px 0 30px;
  background: #fff;
  .margin {
    margin-bottom: 30px;
  }
  .van-cell::after,.van-hairline--top-bottom::after, .van-hairline-unset--top-bottom::after {
    border-top: none;
  }
}
</style>
