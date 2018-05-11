import Vue from 'vue'
import VueMatchMedia from 'vue-match-media/src'
import MobileDetect from 'mobile-detect'

Vue.use(VueMatchMedia);
Vue.prototype.$md = new MobileDetect(window.navigator.userAgent);