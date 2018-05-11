class MenuItem {
  children: Array;
  url: string;

  constructor(item) {
    Object.assign(this, item);
  }

  get hasDropdown() {
    return (Array.isArray(this.children) && this.children.length > 0)
  }

  get aAttrs() {
    const obj = {
      attrs: {href: this.url}
    }
    if (this.hasDropdown) {
      obj.attrs = Object.assign({}, obj.attrs, {
        'href': 'javascript:void(0)',
        'data-toggle': 'dropdown',
        'aria-haspopup': true,
        'aria-expanded': false
      })
      obj.class = 'dropdown-toggle'
    }
    return obj;
  }
}

const wrap = item => new MenuItem(item)

export default {
  namespaced: true,
  state: () => ({
    list: []
  }),
  getters: {
    list(state) {
      return state.list.map(wrap)
    }
  }
}
