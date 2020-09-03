import axios from 'axios';
import qs from 'qs';

axios.jsonp = (url, data) => {
  data = qs.stringify(data);
  if (!url) {
    console.error('Axios.JSONP 至少需要一个url参数!');
    return;
  }
  return new Promise(resolve => {
    window.jsonCallBack = result => {
      resolve(result);
    };
    const JSONP = document.createElement('script');
    JSONP.type = 'text/javascript';
    JSONP.src = `${url}${data}&callback=jsonCallBack`;
    document.getElementsByTagName('head')[0].appendChild(JSONP);
    setTimeout(() => {
      document.getElementsByTagName('head')[0].removeChild(JSONP);
    }, 500);
  });
};
