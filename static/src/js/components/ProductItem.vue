<style lang="scss" module>
  @import "../../scss/inc";

  a.product-item {
    @include reset-link {
      display: block;
    }
    &, &:hover {
      color: unset;
    }
  }

  .product-title {
    font-weight: 700;
    /*font-size: 1.1rem;*/
    @include font-size-with-line-height(1.1rem);
    @include media-breakpoint-down(sm) {
      @include font-size-with-line-height(.8rem)
    }
  }
</style>
<template lang="pug">
  a(:href="product.url || `/products/${product.handle}`", :class="$style.productItem")
    .ratio-5-6.mx-sm-2
      .content.text-center.d-flex.align-items-end
        image-pair(:srcset="product.images | shopifyImgUrls($mq.phone?'medium':'large')")
    .product-detail.text-center.mt-2
      h6.mb-0.mb-sm-1(:class="$style.productTitle") {{product.title}}
      h6
        price(:prices="product.prices")
</template>
<script>
  import {ImagePair} from "@/js/components/index";

  export default {
    components: {ImagePair},
    props: {
      product: {
        type: Object,
        required: true
      }
    }
  }
</script>
