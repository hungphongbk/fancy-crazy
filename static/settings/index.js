import Vue       from 'vue';
import App       from '@settings/App';
import VueRouter from 'vue-router';
import routes    from '@settings/routes';

import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

Vue.use(Vuetify, {
  // theme: {
  //   primary: '#ee44aa',
  //   secondary: '#424242',
  //   accent: '#82B1FF',
  //   error: '#FF5252',
  //   info: '#2196F3',
  //   success: '#4CAF50',
  //   warning: '#FFC107'
  // }
});

Vue.use(VueRouter);
const router = new VueRouter({
  routes
});

new Vue({
  el: '#app',
  render: h => h(App),
  router
});
