const Desktop = () => import( /* webpackChunkName: "desktop" */ './desktop/collection__Layout'),
  Mobile = () => import( /* webpackChunkName: "mobile" */ './mobile/collection__Layout');
import store from '@/js/store';

export default {
  functional: true,
  render(h, {data, children}) {
    if (store.state.mq.tablet) return h(Mobile, data, children);
    return h(Desktop, data, children);
  }
};
