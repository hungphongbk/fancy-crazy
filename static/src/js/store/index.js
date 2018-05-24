import Vue         from 'vue';
import Vuex        from 'vuex';
import menu        from './menu';
import cart        from './cart';
import VuexPersist from 'vuex-persist';
import polyfill    from './_polyfill';

Vue.use(Vuex);

const vuexLocalStorage = new VuexPersist({
  storage: window.localStorage,
  reducer: state => ({
    recently: state.recently
  })
});

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: () => ({
    recently: [],
    isLoading: false,
    lockScroll: false
  }),
  mutations: {
    addToRecently({recently}, {product}) {
      const exists = recently.findIndex(_product => _product.id === product.id);
      if (exists < 0)
        recently.push(product);
      else {
        //swap
        let tmp = recently[0];
        recently[0] = recently[exists];
        recently[exists] = tmp;
      }
    },
    toggleLoading(state, {isLoading}) {
      state.isLoading = isLoading;
    },
    swapProductImage(state, {product, value}) {
      product.isMouseOver = value;
    },
    lockScroll(state, value = undefined) {
      state.lockScroll = value ? value : (!state.lockScroll);
    }
  },
  actions: {
    async addToRecently({commit, state}, handle) {
      let product = state.recently.find(product => product.handle === handle);
      if (typeof product === 'undefined' || product === null)
        product = JSON.parse(await $.get(`//fancycrazy.com/products/${handle}?view=item-json`));
      commit('addToRecently', {product});
    }
  },
  modules: {
    menu,
    cart
  },
  plugins: [vuexLocalStorage.plugin]
});
polyfill(store);

export default store;
