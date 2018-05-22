// import 'bootstrap';
import $bs     from '@/scss/styles.m-scss';
import Vue     from 'vue';
import '@/js/components';
import store   from '@/js/store';
import '@/js/pages';
import '@/js/plugins';
import App     from './App';

import 'vue-transition-css/src/sass/fade.scss';
import mqStore from '@/js/store/mq';

Object.defineProperties(Vue.prototype, {
  $appStore: {
    get: () => store
  },
  $bs: {
    get: () => $bs
  }
});
if (process.env.NODE_ENV !== 'production')
  window.$bs = $bs;
const app = new Vue({
  el: '#app',
  render: h => h(App),
  store,
  mq: {
    phone: '(max-width: 768px)',
    tablet: '(max-width: 991px)',
    desktop: '(min-width: 1199px)'
  }
});

mqStore(app, store);

export default app;
