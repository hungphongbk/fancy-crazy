import Vue           from 'vue';
import VueMatchMedia from 'vue-match-media/src';

if (SSR === 'client')
  Vue.use(VueMatchMedia);
else {
  Vue.prototype.$mq = window.__state__.mq
}
