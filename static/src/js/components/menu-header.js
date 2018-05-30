const MenuDesktop = () => import(/* webpackChunkName: "desktop" */ './desktop/menu-header.vue');
const MenuMobile = () => import(/* webpackChunkName: "mobile" */ './mobile/menu-header.vue');
import './menu-header-mixins';
import responsive from './responsive';

export default responsive(MenuMobile, MenuDesktop);
