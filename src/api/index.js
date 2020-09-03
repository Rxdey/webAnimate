const INTERFACE = {
  // 搜索
  search: {
    url: '/anima/search',
    method: 'get'
  },
  // 订阅记录
  save: {
    url: '/anima/save',
    method: 'get'
  },
  // 详情
  detail: {
    url: '/anima/detail',
    method: 'get'
  },
  // 添加历史记录/订阅/取消订阅
  collect: {
    url: '/anima/collect',
    method: 'get'
  },
  // 更新记录
  update: {
    url: '/anima/update',
    method: 'get'
  },
  // 获取记录
  getRecord: {
    url: '/anima/getRecord',
    method: 'get'
  },
  // 获取所有图片地址
  getImageUrl: {
    url: '/anima/getImageUrl',
    method: 'get'
  },
  // 登录
  login: {
    url: '/login',
    method: 'get'
  }
};

export default INTERFACE;
