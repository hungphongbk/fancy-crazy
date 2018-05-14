export default {
  namespaced: true,
  state: () => ({
    handle: '',
    tag: '',
    title: '',
    totalPages: 0,
    products: [],
    current: 0,
    perPage: 1,
    __cache__: [],
    sidebar: {
      items: []
    },
    reviews: [],
    reviewUrl: ''
  }),
  getters: {
    url: ({handle, tag = ''}) => handle + ((tag && tag.length) > 0 ? ('/' + tag) : ''),
    products: ({products}) => products,
    current: (state) => state.current + 1,
    totalPages: state => state.totalPages,
    pages: ({totalPages}) => Array(totalPages).fill().map((_, index) => ({
      label: index + 1,
      index
    })),
    canNext: state => state.current < state.totalPages - 1,
    canPrev: state => state.current > 0,
    sidebarCollections: ({sidebar}) => sidebar.items.filter(({type}) => type === 'categories'),
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
    }
  },
  mutations: {
    fetchReview(state, reviews) {
      state.reviews = reviews;
    },
    cache(state, {products = [], page = state.current, totalPages = 0, force = false, title = ''} = {}) {
      state.__cache__[page] = (products.length === 0 && !force) ? state.products : products;

      if (totalPages > 0) state.totalPages = totalPages;
      if (title.length > 0) state.title = title;
    },
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
    async fetch({commit, state}) {
      const reviews = await $.get(state.reviewUrl),
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
      commit('fetchReview', obj);
    },
    async _navigate({commit, getters}) {
      window.history.pushState('string', '', '/collections/' + getters.url);
      const {totalPages, products, title} = await $.get(`/collections/${getters.url}?view=json`);
      commit('clearCache');
      commit('cache', {
        products,
        page: 0,
        totalPages,
        title,
        force: true
      });
      commit('toggleLoading', {isLoading: false}, {root: true});
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
      if ((!state.__cache__[page]) || state.__cache__[page].length === 0) {
        commit('toggleLoading', {isLoading: true}, {root: true});
        commit('cache', {
          products: JSON.parse(await $.get(`/collections/${getters.url}?view=json&page=${page + 1}`)).products,
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
