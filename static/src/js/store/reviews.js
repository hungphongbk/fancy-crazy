import Vue from 'vue';

export default {
  namespaced: true,
  state: () => ({}),
  mutations: {
    fetch(state, reviews) {
      for (const key of Object.keys(reviews))
        Vue.set(state, key, reviews[key]);
    }
  }
};
