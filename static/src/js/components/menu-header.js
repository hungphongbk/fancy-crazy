const MenuDesktop = () => import(/* webpackChunkName: "desktop" */ './desktop/menu-header.vue');
const MenuMobile = () => import(/* webpackChunkName: "mobile" */ './mobile/menu-header.vue');
import store from '@/js/store'

export default {
  functional: true,
  render(h, {data, children}) {
    if (store.state.mq.tablet) return h(MenuMobile, data, children);
    return h(MenuDesktop, data, children)
  }
}
