<style lang="scss" scoped>
  .add-to-cart {
    border-radius: unset;
  }
</style>
<style lang="scss" module>
  @import "../../scss/inc";

  .content {
    border-top: 1px solid $gray-300;
  }
  .product-name {
    @include font-size-with-line-height($h2-font-size);
    font-weight: 600;
    font-family: Oswald,serif;
  }
</style>
<template lang="pug">
  .container.pt-5
    .row
      .col-sm-7
        magnifier(:thumb-src="images[0] | shopifyImgUrl('master')", :large-src="images[0] | shopifyImgUrl('master')")
        fragment-image-list
      .col-sm-5
        h1(:class="$style.productName") {{product.title}}
        hr
        h2.prices
          price(:prices="selectedVariant.prices", size="lg")
        fragment-variants.rounded-top
        .btn.btn-primary.btn-lg.rounded-bottom.add-to-cart.w-100(:class="!isVariantAvailable?'rounded-top mt-2':''", @click="addToCart(selectedVariant.id)") BUY IT NOW!
        img.w-100(:src="imgSecurePayment")
        .pt-4.my-2(:class="$style.content", v-html="product.content")
</template>
<script>
  import productModule from '@/js/store/page-product';
  import Magnifier from '@/js/components/magnifier';
  import FragmentVariants from '@/js/fragments/product__Variants';
  import FragmentImageList from '@/js/fragments/product__ImageList';
  import imgSecurePayment from '@/images/mcafee.png';
  import {addToCart} from "@/js/components/mixins/addToCart";
  import {mapGetters, mapState} from 'vuex';

  export default {
    storeModule: ['pageProduct', productModule],
    mixins: [addToCart],
    components: {
      Magnifier,
      FragmentVariants,
      FragmentImageList
    },
    data() {
      return {
        imgSecurePayment
      };
    },
    computed: {
      ...mapState({
        selectedVariant: state => state.pageProduct.selected,
        product: state => state.pageProduct.product
      }),
      ...mapGetters({
        images: 'pageProduct/images',
        isVariantAvailable: 'pageProduct/isVariantAvailable',
        isSale: 'pageProduct/isSale',
        salePercentage: 'pageProduct/salePercentage'
      })
    },
    async created() {
      await Promise.all([
        this.$store.dispatch('addToRecently', this.product.handle),
        this.$store.dispatch('pageProduct/initial')
      ]);
    }
  };
</script>
