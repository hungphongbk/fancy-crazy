import './responsive'
// import './font'
// import './animateCss'
import Vue from 'vue'
import AsyncComputed from 'vue-async-computed'
import VueLocalStorage from 'vue-localstorage'
import VueLazyload from 'vue-lazyload'
import './fontawesome'
// import {delay} from '../components/helpers'
// import './observe-visibility'
import {detect} from 'detect-browser'
//
// import 'vue-carousel'

// Vue.use(VeeValidate);
Vue.use(AsyncComputed);
Vue.use(VueLocalStorage);
Vue.use(VueLazyload, {});

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
})

import * as filters from './filters'

for (const key of Object.keys(filters)) {
  Vue.filter(key, filters[key])
}

const browser = detect();
Object.defineProperty(Vue.prototype, '$browser', {
  get() {
    if (browser) return browser.name;
    return '';
  }
})

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

export {default as Magnifier} from './magnifier'

import './tooltip'

import smoothscroll from 'smoothscroll-polyfill';

// kick off the polyfill!
smoothscroll.polyfill();


