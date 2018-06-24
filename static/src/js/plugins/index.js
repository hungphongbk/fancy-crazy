import './responsive';
// import './font'
// import './animateCss'
import Vue from 'vue';
import AsyncComputed from 'vue-async-computed';
import VueLocalStorage from 'vue-localstorage';
import './fontawesome';
// import {delay} from '../components/helpers'
// import './observe-visibility'
import * as filters from './filters';
import './tooltip';
//
// import 'vue-carousel'

if (SSR === 'client') {
  const VueLazyLoad = require('vue-lazyload'),
    smoothscroll = require('smoothscroll-polyfill'),
    vueScroll = require('vue-scroll').default;
  Vue.use(VueLazyLoad, {
    loading: require('@/images/loading-0.svg')
  });
  Vue.use(vueScroll);
  smoothscroll.polyfill();
}


// Vue.use(VeeValidate);
Vue.use(AsyncComputed);
Vue.use(VueLocalStorage);

Vue.directive('anim', async (el) => {
  const $children = el.children;
  await delay(2000);
  for (const child of $children) {
    await delay(250);
    $(child).addClass('anim')
      .removeClass('before');
  }
});

Vue.mixin({
  created() {
    const {storeModule} = this.$options;
    if (storeModule) {
      const [name, module] = storeModule,
        store = this.$store;
      if (!(store && store.state[name] && store.state[name].registered)) {
        store.registerModule(name, module, {preserveState: true});
        store.state[name].registered = true;
      }
    }
  }
});

for (const key of Object.keys(filters)) {
  Vue.filter(key, filters[key]);
}

// export const tooltip = (el, {value, modifiers = {top: true}}) => $(el).tooltip({
//   placement: (() => {
//     let pos = null;
//     ['top', 'bottom', 'left', 'right'].forEach(p => {
//       if (modifiers[p]) pos = p;
//     });
//     return pos;
//   })(),
//   title: value
// });

const Magnifier = () => import(/* webpackChunkName:"desktop" */ '@/js/components/magnifier');
export {Magnifier};

// kick off the polyfill!
export const GLOBAL_EVENTS = new Vue();

