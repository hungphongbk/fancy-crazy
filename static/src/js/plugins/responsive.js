import Vue           from 'vue';
import VueMatchMedia from 'vue-match-media/src';

if (SSR === 'client')
  Vue.use(VueMatchMedia);
else {
  Object.defineProperty(Vue.prototype, '$mq', {
    get() {
      return {
        phone: false,
        tablet: false,
        desktop: true
      };
    }
  });
}
