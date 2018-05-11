<style lang="scss" module>
  @import "../../scss/inc";

  a.product-item {
    @include reset-link{
      display: block;
    }
    &, &:hover {
      color: unset;
    }
  }

  .product-title {
    font-weight: 700;
    font-size: 1.1rem;
  }
</style>
<template lang="pug">
  a.inner(:href="product.url", :class="$style.productItem")
    .ratio-5-6.mx-2
      .content.text-center.d-flex.align-items-end
        image-pair(:srcset="product.images | shopifyImgUrls('large')")
    .product-detail.text-center.mt-2
      h6(:class="$style.productTitle") {{product.title}}
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
