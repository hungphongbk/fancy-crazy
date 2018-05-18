<style lang="scss" module>
  @import "../../scss/inc";

  .add-to-cart {
    border-radius: unset;
    font-family: Oswald, sans-serif;
    @include font-size-with-line-height($font-size-base*1.7);
  }

  .content {
    border-top: 1px solid $gray-300;
  }

  .product-name {
    @include font-size-with-line-height($h2-font-size);
    font-weight: 600;
    font-family: Oswald, serif;
  }
</style>
<template lang="pug">
  .container.pt-2.px-6
    .row
      .col-sm-7
        magnifier(:thumb-src="SELECTED_IMAGE | shopifyImgUrl('master')", :large-src="SELECTED_IMAGE | shopifyImgUrl('master')")
        fragment-image-list
      .col-sm-5
        h1(:class="$style.productName") {{product.title}}
        hr
        h2
          price(:prices="selectedVariant.prices", size="lg")
        fragment-variants.rounded-top
        .btn.btn-primary.btn-lg.rounded-bottom.w-100(:class="ADD_TO_CART_CLASSES", @click="addToCart(selectedVariant.id)") {{BTN_TITLE}}
        img.w-100(:src="IMG_SECURE_PAYMENT")
        .pt-4.my-2(:class="$style.content", v-html="product.content")
</template>
<script>
  import productModule from '@/js/store/page-product';
  import Magnifier from '@/js/components/magnifier';
  import FragmentVariants from '@/js/fragments/product__Variants';
  import FragmentImageList from '@/js/fragments/product__ImageList';
  import IMG_SECURE_PAYMENT from '@/images/mcafee.png';
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
        IMG_SECURE_PAYMENT,
        BTN_TITLE: 'BUY IT NOW!'
      };
    },
    computed: {
      ...mapState({
        selectedVariant: state => state.pageProduct.selected,
        product: state => state.pageProduct.product
      }),
      ...mapGetters({
        IS_VARIANT_AVAILABLE: 'pageProduct/isVariantAvailable',
        isSale: 'pageProduct/isSale',
        salePercentage: 'pageProduct/salePercentage',
        SELECTED_IMAGE: 'pageProduct/selectedImage'
      }),
      ADD_TO_CART_CLASSES() {
        const bs = this.$bs,
          cls = [this.$style.addToCart];
        if (!this.IS_VARIANT_AVAILABLE) {
          cls.push(...[bs.roundedTop, bs.mt2]);
        }
        if(/^ADD/.test(this.BTN_TITLE))
          cls.push(bs.disabled);
        return cls;
      }
    },
    methods:{
      async addToCart(id) {
        this.BTN_TITLE='ADDING TO CART...';
        await this.$store.dispatch('cart/addToCart', {id});
        this.BTN_TITLE='ADDED TO CART!';
        setTimeout(()=>{
          this.BTN_TITLE='BUY IT NOW!';
        }, 1000)
      }
    },
    async created() {
      await Promise.all([
        this.$store.dispatch('addToRecently', this.product.handle),
        this.$store.dispatch('pageProduct/initial')
      ]);
    }
  };
</script>
