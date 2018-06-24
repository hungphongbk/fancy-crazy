//move desktop-mobile functional components to here
// import '../fragments/collection__Sidebar'

const Index = () => import(/* webpackChunkName: "index" */ './index.vue'),
  Collections = () => import(/* webpackChunkName: "collections" */ './collections.vue'),
  Product = () => import(/* webpackChunkName: "product" */ './product.vue'),
  Article = () => import(/* webpackChunkName: "article" */ './article.vue'),
  General = () => import(/* webpackChunkName: "general" */ './general.vue');

let component;
switch (window.__state__.template) {
  case 'index':
    component = (SSR === 'client' ? Index : require('./index.vue').default);
    break;
  case 'collection':
    component = Collections;
    break;
  case 'product':
    component = Product;
    break;
  default:
    if (/^page/.test(window.__state__.template))
      component = Article;
    else component = General;
}

// Vue.component('site-content', component);
// import c from './index.vue'
//
export default component;
