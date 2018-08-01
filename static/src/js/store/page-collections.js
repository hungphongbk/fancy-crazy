import reviews from './reviews';
import {COLLECTION_GETTER_REVIEWS_GROUP1, COLLECTION_GETTER_REVIEWS_GROUP2} from "@/js/store/types";
import defaultTo from 'lodash/defaultTo';
import keyBy from 'lodash/keyBy';
import {win} from "@/js/global";
import {get} from "@/js/plugins/ajax";

const w = win();

export default {
  namespaced: true,
  modules: {reviews},
  state: () => ({
    handle: '',
    tag: '',
    isBestSelling: false,
    title: '',
    totalPages: 0,
    products: [],
    current: 0,
    perPage: 1,
    __cache__: [],
    sidebar: {
      items: []
    },
    reviewUrl: ''
  }),
  getters: {
    url: ({handle, tag = ''}) => handle + ((tag && tag.length) > 0 ? ('/' + tag) : ''),
    products: ({products}) => products,
    current: (state) => state.current + 1,
    totalPages: state => state.totalPages,
    pages: ({totalPages}, {current}) => {
      const list = Array(totalPages).fill().map((_, index) => ({
        label: index + 1,
        index
      }));
      if (totalPages > current + 3)
        list.splice(current + 1, totalPages - current - 2, {
          label: '...',
          index: -1
        });
      if (current > 3)
        list.splice(1, current - 3, {
          label: '...',
          index: -1
        });

      return list;
    },
    canNext: state => state.current < state.totalPages - 1,
    canPrev: state => state.current > 0,
    sidebarCollections: ({sidebar}) => {
      const items = keyBy(sidebar.items.filter(({type}) => type === 'categories'), i => i.url),
        mapping = {
          'apparel': 'tshirt,hooded-blanket,leggings,hat,bomber-jacket',
          '3d-art': '3d-hoodie,3d-tshirt,3d-dress,3d-skirt',
          'shoes': 'boots-shoes,top-shoes,low-tops,sneakers,slip-ons',
          'car-seat-covers': '',
          'bed': '',
          'pillow': 'feather-pillow,canvas,mug,clock-wall',
          'jewelry': 'jewelry-1,watch,phone-cases,luggage-covers',
          'bag-collections': 'saddle-bag,leather-bag,round-lling-bag',
          'native-handmade': ''
        };
      const rs = [];
      for (const [parent, children] of Object.entries(mapping)) {
        const p = items[parent];
        for (const child of children.split(',')) if (child.length > 0) {
          if (!p.children) p.children = [];
          p.children.push(items[child]);
        }

        rs.push(p);
      }

      return rs;
    },
    sidebarTags: ({sidebar}) => sidebar.items.filter(({type}) => type === 'tags'),
    filteredCollection(state) {
      if (state.handle === 'all') return null;
      return {
        title: state.title,
        url: state.handle
      };
    },
    filteredTag(state, getters) {
      const handle = state.tag,
        tag = getters.sidebarTags.find(t => t.url === handle);
      if (!tag) return null;
      return {
        title: tag.title
      };
    },
    [COLLECTION_GETTER_REVIEWS_GROUP1]: state => defaultTo(state.reviews.group1, []),
    [COLLECTION_GETTER_REVIEWS_GROUP2]: state => {
      const group2 = defaultTo(state.reviews.group2, []);
      return group2.filter(review => review.type === 'image-only');
    }
  },
  mutations: {
    cache(state, {
      products = [],
      page = state.current,
      totalPages = 0,
      force = false,
      title = ''
    } = {}) {
      state.__cache__[page] = (products.length === 0 && !force) ? state.products : products;

      if (totalPages > 0) state.totalPages = totalPages;
      if (title.length > 0) state.title = title;
    },
    showBestSelling: state => state.isBestSelling = true,
    hideBestSelling: state => state.isBestSelling = false,
    clearCache(state) {
      for (const cacheItem of state.__cache__) {
        if (cacheItem)
          cacheItem.length = 0;
      }
    },
    goToPage(state, {page}) {
      state.current = page;
      state.products = state.__cache__[page];
    },
    navigateCollection(state, collection = 'all') {
      state.handle = collection;
    },
    navigateTag(state, tag = '') {
      state.tag = tag;
    }
  },
  actions: {
    async fetch({commit, state}, url = null) {
      try {
        const reviews = await get(url || state.reviewUrl),
          obj = {};
        for (const r of reviews) {
          if (typeof r.rating !== 'undefined') {
            const rating = r.rating.replace(/\s*sao/g, '');
            r.rating = rating * 1.0;
          }

          const group = r.group.replace(/\s/, '');
          if (!obj[group])
            obj[group] = [];
          obj[group].push(r);
        }
        for (const key of Object.keys(obj))
          if (obj[key].length === 0)
            delete obj[key];
        commit('fetchReview', obj);
      } catch (e) {
        //do nothing
        console.log('review not found');
      }
    },
    async _navigate({commit, dispatch, getters}) {
      let isBestSelling = false;

      w.history.pushState('string', '', '/collections/' + getters.url);
      let {id, totalPages, products, title} = await get(`https://us-central1-fancycrazy-895ba.cloudfunctions.net/s/collections/${getters.url}`);
      if (products.length === 0) {
        isBestSelling = true;
        const another = await get(`https://us-central1-fancycrazy-895ba.cloudfunctions.net/s/collections/best-selling`);
        totalPages = another.totalPages;
        products = another.products;
      }
      // alert('ok');
      commit('clearCache');
      commit(isBestSelling ? 'showBestSelling' : 'hideBestSelling');
      commit('cache', {
        url: `/collections/${getters.url}?view=json&${SHOPIFY_THEME_ID}`,
        products,
        page: 0,
        totalPages,
        title,
        force: true
      });
      await dispatch('fetch', `https://us-central1-fancycrazy-895ba.cloudfunctions.net/s/reviews/collections/${id}`);
      commit('toggleLoading', {isLoading: false}, {root: true});
      // alert('ok');
      commit('goToPage', {page: 0});
    },
    async goToCollection({dispatch, commit}, collection = 'all') {
      commit('toggleLoading', {isLoading: true}, {root: true});
      commit('navigateCollection', collection);
      await dispatch('_navigate');
    },
    async goToTag({dispatch, commit}, tag = '') {
      commit('toggleLoading', {isLoading: true}, {root: true});
      commit('navigateTag', tag);
      await dispatch('_navigate');
    },
    async goToPage({commit, getters, state}, {page}) {
      if (page === -1) return;
      const isAll = getters.url === 'all',
        prefix = isAll
          ? 'https://fancycrazy.com'
          : 'https://us-central1-fancycrazy-895ba.cloudfunctions.net/s';

      if ((!state.__cache__[page]) || state.__cache__[page].length === 0) {
        //if is-best-selling, download from best-selling
        const url = state.isBestSelling ?
          `https://us-central1-fancycrazy-895ba.cloudfunctions.net/s/collections/best-selling?page=${page + 1}` :
          `${prefix}/collections/${getters.url + (isAll ? '/' : '')}?page=${page + 1}&view=json`;

        commit('toggleLoading', {isLoading: true}, {root: true});
        commit('cache', {
          products: (await get(url)).products,
          page
        });
        commit('toggleLoading', {isLoading: false}, {root: true});
      }
      commit('goToPage', {page});
    },
    async nextPage({dispatch, state, getters}) {
      if (getters.canNext)
        await dispatch('goToPage', {page: state.current + 1});
    },
    async prevPage({dispatch, state, getters}) {
      if (getters.canPrev) {
        await dispatch('goToPage', {page: state.current - 1});
      }
    }
  }
};
