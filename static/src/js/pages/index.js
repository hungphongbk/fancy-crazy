import Vue from 'vue';

//move desktop-mobile functional components to here
// import '../fragments/collection__Sidebar'

const Index = () => import(/* webpackChunkName: "index" */ './index.vue'),
  Collections = () => import(/* webpackChunkName: "collections" */ './collections.vue'),
  Product = () => import(/* webpackChunkName: "product" */ './product.vue'),
  Article = () => import(/* webpackChunkName: "article" */ './article.vue'),
  General = () => import(/* webpackChunkName: "general" */ './general.vue');

const Pages = {Index, Collections, Product, Article, General};

const component = () => {
  switch (window.__state__.template) {
    case 'index':
      return Pages.Index;
    case 'collection':
      return Pages.Collections;
    // case 'blog':
    //   return Pages.Blog;
    // case 'article':
    //   return Pages.Article;
    // case 'page-vaithuhay':
    //   return Pages.PageVaithuhay;
    case 'product':
      return Pages.Product;
    default:
      if (/^page/.test(window.__state__.template))
        return Pages.Article;
      else return Pages.General;
  }
};

Vue.component('site-content', component());
