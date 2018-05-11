<style lang="scss" scoped>
  @import '../../scss/inc';

  a {
    @include reset-link;
  }

  .index-featured-products {
    display: flex;
    flex-wrap: wrap;
  }

  .product- {
    &item {
      width: percentage(1/4);
      .inner {
        padding: 0 5%;
      }
      img.img-fluid {
        width: 100%;
      }
    }
    &detail {

    }
  }

  .ratio-3-4 {
    @include aspect-ratio(3, 4)
  }

  a {
    @include reset-link {
      display: inline-block;
    }
    color: inherit;
  }
</style>
<template lang="pug">
  div
    .text-center
      h3 RECENTLY VIEWED PRODUCTS
      hr
    .index-featured-products
      .product-item(v-for="product in products", @mouseover="()=>product.mouseEnter()", @mouseleave="()=>product.mouseLeave()")
        .inner
          .ratio-3-4
            .content.text-center.d-flex.align-items-end
              img.img-fluid(:src="product.currentImage | shopifyImgUrl")
          .product-detail.text-center
            a(:href="product.url")
              h5.product-title {{product.title}}
              h6 from &nbsp;
                price(:prices="product.prices")
</template>
<script>
  import wrap from '@/js/components/ProductItemWrap'
  import deepClone from 'lodash/cloneDeep'

  export default {
    data() {
      return {
        products$: deepClone(this.$store.state.recently)
      }
    },
    computed:{
      products(){
        return this.products$.map(wrap);
      }
    }
  }
</script>
