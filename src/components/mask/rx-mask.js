import rxMaskComponent from './rx-mask.vue';
import mount from './mount';
import Bus from '../../common/bus';

export default {
  open (vm, config = {}) {
    this.vm = vm;
    this.update(config);
  },
  close () {
    Bus.$mask.show = false;
  },
  update (config = {}) {
    let { $mask } = Bus;
    if (!$mask) {
      $mask = mount(rxMaskComponent, config);
      $mask.maskClick = this.onClick.bind(this);
      Bus.$mask = $mask;
    }
    Bus.$mask.show = !Bus.$mask.show;
  },
  onClick () {
    this.vm.maskClick();
  }
};
