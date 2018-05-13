<style lang="scss" scoped>
  @import '../../scss/inc';
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
  }
</style>
<style lang="scss" module>
  @import '../../scss/inc';

  .recently-products {
    a {
      @include reset-link {
        display: inline-block;
      }
      color: inherit;
    }
  }
</style>
<template lang="pug">
  div(:class="$style.recentlyProducts")
    .text-center
      h3 RECENTLY VIEWED PRODUCTS
      hr
    .d-flex.flex-wrap
      .product-item(v-for="product in products", @mouseover="()=>product.mouseEnter()", @mouseleave="()=>product.mouseLeave()")
        .inner
          .ratio-3-4
            .content.text-center.d-flex.align-items-end
              image-pair(:srcset="product.images | shopifyImgUrls")
          .product-detail.text-center
            a(:href="product.url")
              h5.product-title {{product.title}}
              h6 from &nbsp;
                price(:prices="product.prices")
</template>
<script>
  import {ImagePair} from "@/js/components";

  export default {
    components: {ImagePair},
    data() {
      return {
        products: this.$store.state.recently
      }
    }
  }
</script>
