import { rxLocalStorage } from '../../common/utils';

const mutations = {
  keepAlive (state, data) {
    state.keepAlive = data;
  },
  // 加载动画
  loading (state, data) {
    state.loading = data;
  },
  // 存储数据
  saveData (state, obj) {
    const { key, data } = obj;
    state[key] = data;
  },
  // 清空登录信息
  checkOut () {
    rxLocalStorage.clear();
  }
};
export default mutations;
