import keepAliveVal from '@/router/isKeepAlive';
import store from '../../store';
// keepalive操作
const mixins = {
  methods: {
    getImage: (value) => value,

    resetKeepAive () {
      const conf = keepAliveVal;
      window.sessionStorage.removeItem('scroll');
      store.commit('keepAlive', conf);
    },
    addKeepAlive (name) {
      const conf = store.state.keepAlive;
      if (conf.includes(name)) return;
      conf.push(name);
      store.commit('keepAlive', conf);
    },
    removeKeepAlive (nameList) {
      const conf = store.state.keepAlive;
      if (typeof nameList === 'string') nameList = nameList.split(',');
      nameList.forEach(name => {
        if (!name) return;
        name = name.trim();
        const i = conf.indexOf(name);
        if (i > -1) {
          conf.splice(i, 1);
          // 移除滚动条缓存
          const scroll = window.sessionStorage.getItem('scroll') || '{}';
          const temp = JSON.parse(scroll);
          Object.keys(temp).map(item => {
            if (item.substring(1).toUpperCase() === name.toUpperCase()) {
              temp[item].scrollTop = 0;
            }
          });
          window.sessionStorage.setItem('scroll', JSON.stringify(temp));
          store.commit('keepAlive', conf);
        }
      });
    }
  }
};
export default mixins;
