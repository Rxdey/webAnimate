import api from '@/api';
import { request } from '../common/request/index';

// 从api导出接口数据
const data = Object.keys(api).reduce((prve, next) => {
  prve[next] = (...arg) => request.call(null, api[next], ...arg);
  return prve;
}, {});


export default data;
