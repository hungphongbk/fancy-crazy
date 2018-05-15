import Vue from 'vue';

export default {
  state: () => ({}),
  mutations: {
    fetchReview(state, reviews) {
      for (const key of Object.keys(reviews))
        Vue.set(state, key, reviews[key]);
    }
  }
};
