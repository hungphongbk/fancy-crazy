const filterImg = (images, onlySizeCharts = false) =>
  images.filter(url => /sizechart_.*?\./.test(url) === onlySizeCharts);

export default {
  namespaced: true,
  state: () => ({
    product: {
      images: [],
      variants: []
    },
    selected: {
      title: '',
      id: -1,
      prices: {
        original: 0,
        sale: 0
      }
    }
  }),
  getters: {
    images: (state) => {
      return filterImg(state.product.images);
    },
    sizecharts({product}) {
      return filterImg(product.images, true);
    },
    isVariantAvailable({product}) {
      return product.variants.length > 1;
    },
    selected: ({selected}) => selected,
    isSale: ({selected}) => selected.prices.original > selected.prices.sale,
    salePercentage: ({selected}, {isSale}) => {
      if (isSale) {
        const {original, sale} = selected.prices;
        return Math.round((original - sale) * 100 / original);
      } else return 0;
    }
  },
  mutations: {
    select(state, {variantId}) {
      state.selected = state.product.variants.find(({id}) => id === variantId);
    }
  },
  actions: {
    initial({commit, state}) {
      commit('select', {variantId: state.product.variants[0].id});
    }
  }
};
