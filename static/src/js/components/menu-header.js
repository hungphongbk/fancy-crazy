import './menu-header-mixins';
import responsive from './responsive';

const MenuDesktop = () => import(/* webpackChunkName: "desktop" */ './desktop/menu-header.vue');
const MenuMobile = () => import(/* webpackChunkName: "mobile" */ './mobile/menu-header.vue');

const Component = SSR === 'client' ? responsive(
  MenuMobile,
  MenuDesktop) : global.window.__state__.mq.phone ? MenuMobile : MenuDesktop;

export default Component;
