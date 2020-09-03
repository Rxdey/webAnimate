// eslint-disable-next-line import/prefer-default-export
export const loadMap = (ak = process.env.VUE_APP_MAPKEY) => new Promise((resolve, reject) => {
  if (!ak) return;
  if (typeof BMap !== 'undefined') {
    resolve(window.BMap);
    return true;
  }
  window.onBMapCallback = function () {
    resolve(window.BMap);
  };
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = `http://api.map.baidu.com/api?v=3.0&ak=${ak}&callback=onBMapCallback`;
  script.onerror = reject;
  document.head.appendChild(script);
});
// 微信浏览器
export const isWechat = () => /MicroMessenger/i.test(window.navigator.userAgent.toLowerCase());

// 是否为pc设备
export const deviceIsPC = () => {
  const userAgentInfo = navigator.userAgent;
  const Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
  return !Agents.some(item => userAgentInfo.includes(item));
};
// ios 1/ android 0
export const mobileType = () => {
  const u = navigator.userAgent;
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; // android终端
  const isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios终端
  if (isAndroid) {
    return 1; // ios
  } if (isiOS) {
    return 0;
  }
  return 1;
};
// 创建表单提交
// process.env.VUE_APP_CARLINK, 'contentJson',
export const formSubmit = (url, name, value) => {
  const form = document.createElement('form');
  form.action = url;
  form.method = 'post';
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = name;
  input.value = value;
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
};
