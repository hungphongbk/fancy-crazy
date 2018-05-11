import Vue         from 'vue';
import Vuex        from 'vuex';
import menu        from './menu';
import cart        from './cart';
import VuexPersist from 'vuex-persist';
import store2      from 'store2';

Vue.use(Vuex);

const vuexLocalStorage = new VuexPersist({
  storage: window.localStorage,
  reducer: state => ({
    recently: state.recently,
    pageIndex: {
      reviews: state.pageIndex.reviews
    }
  })
});

const store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  state: () => ({
    recently: [],
    isLoading: false
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
    }
  },
  actions: {
    async addToRecently({commit, state}, handle) {
      let product = state.recently.find(product => product.handle === handle);
      if (typeof product === 'undefined' || product === null)
        product = JSON.parse(await $.get(`//veteranthing.com/products/${handle}?view=item-json`));
      commit('addToRecently', {product});
    }
  },
  modules: {
    menu,
    cart
  },
  plugins: [vuexLocalStorage.plugin]
});
store.replaceState(Object.assign({}, store2.get('vuex', {}), __state__, {
  cart: cart.state()
}));

export default store;
