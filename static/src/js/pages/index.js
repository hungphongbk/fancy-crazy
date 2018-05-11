import Vue from 'vue'

const Index = () => import(/* webpackChunkName: "index" */ './index.vue'),
  Collections = () => import(/* webpackChunkName: "collections" */ './collections.vue'),
  Product = () => import(/* webpackChunkName: "product" */ './product.vue');

const Pages = {Index, Collections, Product};

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
      return Pages.Product
  }
};

Vue.component('site-content', component());
