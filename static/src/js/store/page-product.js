import Vue from 'vue';
import {shopifyImgUrl} from "@/js/plugins/filters";
import {assert} from "@/js/plugins/helpers";

const filterImg = (images, onlySizeCharts = false) =>
  images.filter(url => /sizechart_/g.test(url) === onlySizeCharts);

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
    },
    selectedImage: 0
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
    },
    selectedImage: ({product, selectedImage, selected}) => {
      return product.images[selectedImage]
        || selected.image;
    }
  },
  mutations: {
    refine(state) {
      state.product.images = state.product.images.filter(i => assert(i) && typeof i === 'string');
    },
    select(state, {variantId, onInitial = false}) {
      state.selected = state.product.variants.find(({id}) => id === variantId);
    },
    selectImage(state, {index}) {
      state.selectedImage = index;
    }
  },
  actions: {
    initial({commit, state}) {
      // commit('refine');
      commit('select', {variantId: state.product.variants[0].id, onInitial: true});
    },
    select({commit, state, getters}, variant) {
      commit('select', variant);

      //find image and selected it
      Vue.nextTick(() => {
        const variantImg = shopifyImgUrl(state.selected.image, 'large', false),
          index = state.product.images.findIndex(i => i === variantImg);
        commit('selectImage', {index});
      });
    }
  }
};
