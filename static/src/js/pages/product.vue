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
  @include media-breakpoint-down(sm){
    .prices{
      font-size: $h4-font-size;
    }
  }
</style>
<template lang="pug">
  .container.pt-2.px-sm-6
    .row
      .col-sm-7
        template(v-if="$mq.desktop")
          magnifier(:thumb-src="SELECTED_IMAGE | shopifyImgUrl('master')", :large-src="SELECTED_IMAGE | shopifyImgUrl('master')")
          fragment-image-list
        img.img-fluid(:src="SELECTED_IMAGE | shopifyImgUrl('grande')")
      .col-sm-5
        h1(:class="$style.productName") {{product.title}}
        hr
        h2(:class="$style.prices")
          price(:prices="selectedVariant.prices", size="lg")
        fragment-variants.rounded-top
        .btn.btn-primary.btn-lg.rounded-bottom.w-100(:class="ADD_TO_CART_CLASSES", @click="addToCart(selectedVariant.id)") {{BTN_TITLE}}
        img.w-100(:src="IMG_SECURE_PAYMENT")
        .text-center.px-6
          p <b>All our products are custom printed and designed with love just for you!</b>
          p You can expect the following delivery times to receive your personalized shirt:
          p
            | US Orders: 1 - 2 weeks
            br
            | INT Orders: 2 - 3 weeks
        fragment-expandable.pt-2.my-2(:content="product.content")
        .text-center.px-6.pt-4
          h5 Good Fancy Crazy Guaranteed
          p <i>Melts in Your Heart, Not in Your Eyes</i>
          p Join more than 70 thousand delighted customers sharing good Fancy in over 130 different countries!
          p Not fully Fancy Crazy with your products?
            br
            |No worries! We've got it covered.
          p +1 914-598-8976 | support@fancycrazy.com
</template>
<script>
  import productModule from '@/js/store/page-product';
  import Magnifier from '@/js/components/magnifier';
  import FragmentVariants from '@/js/fragments/product__Variants';
  import FragmentImageList from '@/js/fragments/product__ImageList';
  import IMG_SECURE_PAYMENT from '@/images/mcafee.png';
  import {addToCart} from "@/js/components/mixins/addToCart";
  import {mapGetters, mapState} from 'vuex';
  import FragmentExpandable from "@/js/fragments/product__Expandable";

  export default {
    storeModule: ['pageProduct', productModule],
    mixins: [addToCart],
    components: {
      Magnifier,
      FragmentVariants,
      FragmentImageList,
      FragmentExpandable
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
        if (/^ADD/.test(this.BTN_TITLE))
          cls.push(bs.disabled);
        return cls;
      }
    },
    methods: {
      async addToCart(id) {
        this.BTN_TITLE = 'ADDING TO CART...';
        await this.$store.dispatch('cart/addToCart', {id});
        this.BTN_TITLE = 'ADDED TO CART!';
        setTimeout(() => {
          this.BTN_TITLE = 'BUY IT NOW!';
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
