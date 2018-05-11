import {get, post} from "@/js/plugins/ajax";

function ifHasVariantId(items, id) {
  return items.findIndex(item => item.variant_id === id);
}

async function mixCartItems(items) {
  return Promise.all(items.map(item => new Promise(resolve => {
    get(`/products/${item.handle}?view=json`, true)
      .then(({product}) => {
        const variant = product.variants.find(variant => variant.id === item.variant_id);

        item.prices = {
          original: variant.compare_at_price * 100.0,
          sale: variant.price * 100.0
        };
        resolve(item);
      });
  })));
}

const tuple = item => ({
  original: item.prices.original * item.quantity,
  sale: item.prices.sale * item.quantity
});

export default {
  namespaced: true,
  state: () => ({
    items: [],
    count: 0,
    totalPrice: 0,
    token: '',
    showPopup: false,
    isLoading: false
  }),
  getters: {
    totalRegular: ({items}) => items.map(tuple).reduce((acc, {original}) => acc + original, 0),
    totalSub: ({items}) => items.map(tuple).reduce((acc, {sale}) => acc + sale, 0),
    totalSaving: (_, getters) => getters.totalRegular - getters.totalSub
  },
  mutations: {
    loading: state => state.isLoading = true,
    loaded: state => state.isLoading = false,
    fetch(state, {items, count, totalPrice, token}) {
      state.items = items;
      state.count = count;
      state.totalPrice = totalPrice;
      state.token = token;
    },
    addToCart(state, {lineItem}) {
    },
    togglePopup(state) {
      state.showPopup = !state.showPopup;
    }
  },
  actions: {
    fetch({commit, state}) {
      if (!state.isLoading)
        commit('loading');
      return get('/cart.js').then(async body => {
        const items = await mixCartItems(body.items);
        commit('fetch', {
          items,
          count: body.item_count,
          totalPrice: body.total_price,
          token: body.token
        });
        commit('loaded');
      });
    },
    addToCart({commit, dispatch}, {id, quantity = 1}) {
      commit('loading');
      return post('/cart/add.js', {
        id, quantity
      }).then(lineItem => {
        commit('addToCart', {lineItem});
        dispatch('fetch');
      });
    },
    changeItem({commit, dispatch}, {id, quantity}) {
      commit('loading');
      return post('/cart/change.js', {id, quantity})
        .then(() => {
          dispatch('fetch');
        });
    },
    removeItem({commit, dispatch}, {id}) {
      commit('loading');
      return post('/cart/change.js', {id, quantity: 0})
        .then(() => {
          dispatch('fetch');
        });
    }
  }
};
