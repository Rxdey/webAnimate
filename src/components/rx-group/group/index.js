import rxGroup from './group.vue';

rxGroup.install = function(Vue) {
  Vue.component(rxGroup.name, rxGroup);
};

export default rxGroup;
