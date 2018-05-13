import $bs from '@/scss/styles.m-scss'

class MenuItem {
  children: Array;
  url: string;
  hasDropdown: boolean;

  constructor(item) {
    Object.assign(this, item);
    this.hasDropdown = (Array.isArray(this.children) && this.children.length > 0);
  }

  get aAttrs() {
    const obj = {
      attrs: {href: this.url}
    };
    if (this.hasDropdown) {
      obj.attrs = Object.assign({}, obj.attrs, {
        'href': 'javascript:void(0)',
        // 'data-toggle': 'dropdown',
        'aria-haspopup': true,
        'aria-expanded': false
      });
      obj.class = $bs.dropdownToggle;
    }
    return obj;
  }
}

const wrap = item => new MenuItem(item);

export default {
  namespaced: true,
  state: () => ({
    list: []
  }),
  getters: {
    list(state) {
      return state.list.map(wrap);
    }
  }
};
