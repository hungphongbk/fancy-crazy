import $bs      from '@/scss/styles.m-scss';
import Vue      from 'vue';
import '@/js/components';
import store    from '@/js/store';
import 'vue-transition-css/src/sass/fade.scss';
import mqStore  from '@/js/store/mq';
import polyfill from "@/js/store/_polyfill";
// import '@/js/plugins';
// import App from './App'

Vue.prototype.$appStore = store;
Vue.prototype.$bs = $bs;
if (process.env.NODE_ENV !== 'production')
  window.$bs = $bs;

export default () => {
  require('@/js/plugins');
  polyfill(store);
  const App = require('./App').default;
  const app = new Vue({
    render: h => h(App),
    // render: h=>h('div',['fuck']),
    store,
    mq: {
      phone: '(max-width: 768px)',
      tablet: '(max-width: 991px)',
      desktop: '(min-width: 1199px)'
    }
  });
  mqStore(app, store);

  return app;
}
