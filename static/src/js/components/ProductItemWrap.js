import Vue from 'vue';
import store from '../store';

export default function (product) {
  // if (typeof product.isMouseOver !== 'undefined') return product;
  // console.log('extend product');
  if (typeof product.isMouseOver === 'undefined')
    Vue.set(product, 'isMouseOver', 0);
  return Object.create(product, {
    currentImage: {
      get() {
        return product.images[product.isMouseOver];
      }
    },
    mouseEnter: {
      get: () => () => {
        product.isMouseOver = 1;
        // store.commit('swapProductImage', {product, value: 1});
      }
    },
    mouseLeave: {
      get: () => () => {
        product.isMouseOver = 0;
        // store.commit('swapProductImage', {product, value: 0});
      }
    }
  });

  // return product;
};
