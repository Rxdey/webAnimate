// url解析
export const urlReg = /(\w+):\/\/([^\:|\/]+)(\:\d*)?(.*\/)([^#|\?|\n]+)?(#.*)?(\?.*)?/i;

/**
 * 生产随机字符串
 * @param length 长度
 */
export const random = (length = 5) => {
  let str = Math.random().toString(36).substr(2);
  if (str.length >= length) return str.substr(0, length);
  str += random(length - str.length);
  return str;
};
/**
 * localStorage 同域名增加pathname前缀
 */
export const rxLocalStorage = {
  removeItemList (array = []) {
    const tag = `${window.location.pathname}__UNLIMIT__`;
    array.map(item => {
      localStorage.removeItem(tag + item);
    });
  },
  clear () {
    const length = localStorage.length;
    const tag = `${window.location.pathname}__UNLIMIT__`;
    const REG = new RegExp(`\\${tag}`);
    const temp = [];
    for (let i = 0; i < length; i++) {
      REG.test(localStorage.key(i)) && temp.push(localStorage.key(i));
    }
    temp.map(item => {
      localStorage.removeItem(item);
    });
  },
  getItem (name) {
    const tag = `${window.location.pathname}__UNLIMIT__`;
    return localStorage.getItem(tag + name);
  },
  setItem (name, data) {
    const tag = `${window.location.pathname}__UNLIMIT__`;
    localStorage.setItem(tag + name, data);
  },
  removeItem (name) {
    const tag = `${window.location.pathname}__UNLIMIT__`;
    localStorage.removeItem(tag + name);
  }
};

/**
 * sessionStorage 同域名增加pathname前缀
 */
export const rxSessionStorage = {
  removeItemList (array = []) {
    const tag = `${window.location.pathname}__UNLIMIT__`;
    array.map(item => {
      sessionStorage.removeItem(tag + item);
    });
  },
  clear () {
    const length = sessionStorage.length;
    const tag = `${window.location.pathname}__UNLIMIT__`;
    const REG = new RegExp(`\\${tag}`);
    const temp = [];
    for (let i = 0; i < length; i++) {
      REG.test(sessionStorage.key(i)) && temp.push(sessionStorage.key(i));
    }
    temp.map(item => {
      sessionStorage.removeItem(item);
    });
  },
  getItem (name) {
    const tag = `${window.location.pathname}__UNLIMIT__`;
    return sessionStorage.getItem(tag + name);
  },
  setItem (name, data) {
    const tag = `${window.location.pathname}__UNLIMIT__`;
    sessionStorage.setItem(tag + name, data);
  },
  removeItem (name) {
    const tag = `${window.location.pathname}__UNLIMIT__`;
    sessionStorage.removeItem(tag + name);
  }
};

// 获取链接参数
export const getCode = name => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};

// 获取hash参数
export const getHashCode = name => {
  const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
  if (window.location.hash.split('?')[1]) {
    const r = window.location.hash.split('?')[1].match(reg);
    if (r != null) return unescape(r[2]);
  }
  return null;
};
// 更换title
export const changeTitle = title => {
  document.title = title;
  if (navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
    const i = document.createElement('iframe');
    i.src = '';
    i.style.display = 'none';
    i.onload = function () {
      setTimeout(() => {
        i.remove();
      }, 9);
    };
    document.body.appendChild(i);
  }
};
// 日期格式化
export const dateFormat = (date, fmt = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return '';
  if (typeof date === 'string') {
    date = new Date(date.replace(/-/g, '/'));
  }
  if (typeof date === 'number') {
    date = new Date(date);
  }
  const o = {
    'M+': date.getMonth() + 1,
    'D+': date.getDate(),
    'h+': date.getHours() % 12 === 0 ? 12 : date.getHours() % 12,
    'H+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
    'q+': Math.floor((date.getMonth() + 3) / 3),
    S: date.getMilliseconds()
  };
  const week = {
    0: '\u65e5',
    1: '\u4e00',
    2: '\u4e8c',
    3: '\u4e09',
    4: '\u56db',
    5: '\u4e94',
    6: '\u516d'
  };
  if (/(Y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, `${date.getFullYear()}`.substr(4 - RegExp.$1.length));
  }
  if (/(E+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (RegExp.$1.length > 1 ? (RegExp.$1.length > 2 ? '\u661f\u671f' : '\u5468') : '')
      + week[`${date.getDay()}`]
    );
  }
  Object.keys(o).map((k) => {
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : `00${o[k]}`.substr(`${o[k]}`.length)
      );
    }
  });
  return fmt;
};
/**
 * 金额计算
 * @param {Number} value 数值
 * @param {Number} fixed 小数位数
 */
export const money = (value, fixed = 2, unit = '') => {
  const val = parseFloat(value);
  // eslint-disable-next-line no-restricted-globals
  if (isNaN(val)) return 0 + unit;
  const actions = {
    100000000: '亿',
    10000000: '千万',
    10000: '万'
  };
  const act = Object.keys(actions).sort((a, b) => b - a).find(item => val / parseInt(item, 10) >= 1);
  return act ? (val / parseInt(act, 10)).toFixed(fixed) + actions[act] + unit : val.toFixed(fixed) + unit;
};
// 复制文本
export const copyText = (node, cb = () => { }) => {
  const range = document.createRange();
  range.selectNodeContents(node);
  const selection = document.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  document.execCommand('Copy');
  selection.removeAllRanges();
  cb();
};
// 根据key获取Obj
export const getObjByKey = (key, array) => {
  if (!key || !array) return { key, value: '' };
  return array.find(item => item.key === key) || { key, value: '' };
};
// 根据key获取value
export const getValueByKey = (key, array) => {
  if (!key || !array) return '';
  return array.find(item => item.key === key) ? array.find(item => item.key === key).value : '';
};
// 根据value获取key
export const getKeyByValue = (value, array) => {
  if (!value || !array) return '';
  return array.find(item => item.value === value) ? array.find(item => item.value === value).key : '';
};
// 根据value获取name
export const getNameByValue = (value, arr) => {
  if (!value && JSON.stringify(value) !== '{}') return '';
  if (typeof value !== 'string') {
    value = `${value.insOccupation}_${value.insOccupationGrade}`;
  }
  const temp = arr.find(item => (item.value === value));
  return temp ? temp.name : '';
};
// 获取地址
export const getAddressName = (value, addressData) => {
  if (!addressData.length || !value.length) return '';
  const name = [];
  addressData.forEach(item => {
    if (value.includes(item.value)) {
      name.push(item.name);
    }
  });
  return name.join(' ');
};
// 节流
export const throttle = (func, wait) => {
  let previous = 0;
  return function () {
    const now = +new Date();
    const context = this;
    if (now - previous >= wait) {
      // eslint-disable-next-line prefer-rest-params
      func.apply(context, arguments);
      previous = now;
    }
  };
};
// 防抖
export const debounce = (func, wait) => {
  if (typeof func !== 'function') {
    throw new TypeError('need a function');
  }
  wait = +wait || 0;
  let timeId = null;
  return function() {
    const self = this;
    // eslint-disable-next-line prefer-rest-params
    const args = arguments;
    if (timeId) {
      clearTimeout(timeId);
    }
    timeId = setTimeout(() => {
      func.apply(self, args);
    }, wait);
  };
};
// 获取当前月天数
const mGetDate = (year, month) => {
  const d = new Date(year, month + 1, 0);
  return d.getDate();
};

/**
 * 添加日期
 * @param {string|Date} date 日期
 * @param {number} type 0 天 1 月 2 年
 * @param {number} num 数量
 */
export const addDateByType = (date, type = 0, num = 1) => {
  const tempDate = new Date(date);
  const action = {
    0: () => {
      if (num > 0) {
        tempDate.setDate(tempDate.getDate() + parseInt(num, 10) - 1);
      } else {
        tempDate.setDate(tempDate.getDate() - (Math.abs(num) - 1));
      }
      return dateFormat(tempDate, 'YYYY-MM-DD');
    },
    1: () => {
      const dd = new Date();
      dd.setDate(1); // 防止添加月没有当前天数
      const mouth = tempDate.getMonth() + num;
      dd.setFullYear(tempDate.getFullYear());
      dd.setMonth(mouth);
      const currentDays = mGetDate(tempDate.getFullYear(), tempDate.getDate()); // 当前日期的总天数
      const mouthDays = mGetDate(dd.getFullYear(), dd.getMonth()); // 保障日期最后一个月的总天数
      if (mouthDays < tempDate.getDate() || currentDays === tempDate.getDate()) {
        dd.setDate(mouthDays);
      } else {
        dd.setDate(tempDate.getDate() - 1);
      }
      return dateFormat(dd, 'YYYY-MM-DD');
    },
    2: () => {
      const dd = new Date();
      dd.setDate(1);
      num > 0 ? dd.setFullYear(tempDate.getFullYear() + num) : dd.setFullYear(tempDate.getFullYear() - num);
      dd.setMonth(tempDate.getMonth());
      num > 0 ? dd.setDate(tempDate.getDate() - 1) : dd.setDate(tempDate.getDate() + 1);
      return dateFormat(dd, 'YYYY-MM-DD');
    }
  };
  return action[type]() || '';
};
