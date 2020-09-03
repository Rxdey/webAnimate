import axios from 'axios';
import { Toast } from 'vant';
import qs from 'qs';
import { rxLocalStorage } from '@/common/utils';
// import loading from '@/components/vue-loading/loading';
import store from '@/store';
import { BASE_URL } from '@/api/api.config';
// import './jsonp';

// 请求中断
// const { CancelToken } = axios;
window.pending = [];

const conf = {
  method: 'get',
  url: '/',
  baseURL: BASE_URL,
  headers: {
    'content-type': 'application/x-www-form-urlencoded'
  },
  timeout: 100000,
  isQs: true
};
const defaultInstance = (config) => {
  const instance = axios.create(config);
  instance.interceptors.request.use((res) => res);
  instance.interceptors.response.use((response) => {
    const { state, msg } = response.data;
    if (!state && !response.config.params.hideToast) {
      Toast({ className: 'error-msg', message: msg, duration: 4000, position: 'top' });
    }
    return response;
  }, (error) => {
    const status = error.request ? error.request.status : 0;
    const action = {
      404: '找不到请求地址',
      500: '系统异常',
      504: '请求超时，请检查网络环境并重试'
    };
    if (error.config) {
      console.error(`接口:${error.config.url}  异常 --- ${error.message}`);
      Toast({ className: 'error-msg', message: `ERROR: ${status} - ${action[status] || '系统异常'} >_<`, duration: 3500 });
    }
    return { data: { state: 0, type: 'error' } };
  });
  return instance;
};
/**
 * 请求封装
 * @param {Object} config 请求配置
 * @param {Object} data 参数
 * @param {Object} options 配置项
 */
export const request = async (config, data = {}, { isQs = true, loading = true, userId = true } = {}) => {
  if (config.type === 'jsonp') {
    store.commit('loading', false);
    return axios.jsonp(config.url, data);
  }
  const setting = Object.assign({}, conf, config); // 简单的merge下
  setting.headers = Object.assign({}, conf.headers, config.headers);
  const { method } = setting;
  setting.params = null;
  setting.data = null;
  if (!data.userId && userId) {
    data.userId = rxLocalStorage.getItem('userId') || '';
  }
  if (!data.username) {
    data.username = rxLocalStorage.getItem('username') || '';
  }
  if (method.toUpperCase() === 'GET') {
    setting.params = data;
  } else {
    setting.data = isQs ? qs.stringify(data) : data;
  }
  const instance = defaultInstance();
  if (loading) store.commit('loading', true);
  try {
    const res = await instance(setting);
    if (loading) store.commit('loading', false);
    return res.data;
  } catch (error) {
    console.error(error);
    if (loading) store.commit('loading', false);
    return { state: 0 };
  }
};

export default request;
