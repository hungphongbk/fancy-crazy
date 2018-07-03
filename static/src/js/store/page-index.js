import {get} from "@/js/plugins/ajax";

export default {
  namespaced: true,
  state: () => ({
    collections: [],
    featuredProducts: [],
    reviews: {}
  }),
  mutations: {
    fetch(state, reviews) {
      state.reviews = reviews;
    }
  },
  actions: {
    async fetch({commit}) {
      const reviews = await get('https://us-central1-fancycrazy-895ba.cloudfunctions.net/s/reviews/index'),
        obj = {};
      for (const r of reviews) {
        const group = r.group.replace(/\s/, '');
        if (!obj[group])
          obj[group] = [];
        obj[group].push(r);
      }
      commit('fetch', obj);
    }
  }
};
