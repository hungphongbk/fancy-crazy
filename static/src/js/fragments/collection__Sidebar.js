import './mixins/collection__Sidebar';
import store from '@/js/store';

const Desktop = () => import( /* webpackChunkName: "desktop" */ './desktop/collection__Sidebar'),
  Mobile = () => import( /* webpackChunkName: "mobile" */ './mobile/collection__Sidebar');

export default {
  functional: true,
  render(h, {data, children}) {
    if (store.state.mq.phone) return h(Mobile, data, children);
    return h(Desktop, data, children);
  }
};
