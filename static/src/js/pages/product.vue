<style lang="scss" module>
  @import "../../scss/inc";

  .add-to-cart {
    border-radius: unset;
    font-family: Oswald, sans-serif;
    @include font-size-with-line-height($font-size-base*1.7);

    @include media-breakpoint-down(sm) {
      &-wrapper {
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        height: auto;
        padding: 1rem {
          top: .5rem;
        }
        z-index: 10;
        background-color: white;
        @include lbn-box-shadow(-2px);
      }
    }
  }

  .content {
    border-top: 1px solid $gray-300;
  }

  .product-name {
    @include font-size-with-line-height($h2-font-size*0.9);
    font-weight: 600;
    font-family: Oswald, serif;
  }

  @include media-breakpoint-down(sm) {
    .page-product {
      position: relative;
      font-size: .9em;
    }
    .prices {
      font-size: $h4-font-size;
    }
  }
</style>
<template lang="pug">
  .container.pt-2.px-sm-6.pb-6(:class="$style.pageProduct")
    .row
      .col-sm-7
        template(v-if="!$mq.phone")
          magnifier(:src="SELECTED_IMAGE | shopifyImgUrl('master')")
          fragment-image-list
        .row.pb-4(v-else)
          .col-3
            fragment-image-list
          .col-9.pl-0.pt-4
            .ratio-6-7
              .content
                img.img-fluid(:src="SELECTED_IMAGE | shopifyImgUrl('grande')")
      .col-sm-5
        h1(:class="$style.productName") {{product.title}}
        hr
        h3(:class="$style.prices")
          price(:prices="selectedVariant.prices", size="lg")
        fragment-variants.rounded-top
        div(:class="{ [$style.addToCartWrapper]: true }", :style="ADD_TO_CART_OUTER_SCROLL")
          .btn.btn-primary.btn-lg.rounded-bottom.w-100(:class="ADD_TO_CART_CLASSES", @click="addToCart(selectedVariant.id)") {{BTN_TITLE}}
        #addToCart
        img.w-100(:src="IMG_SECURE_PAYMENT")
        .text-center.px-2.px-sm-6
          p <b>All our products are custom printed and designed with love just for you!</b>
          p You can expect the following delivery times to receive your personalized shirt:
          p
            | US Orders: 1 - 2 weeks
            br
            | INT Orders: 2 - 3 weeks
        fragment-expandable.pt-2.my-2(:content="product.content")
        .text-center.px-2.px-sm-6.pt-4
          h5 Good Fancy Crazy Guaranteed
          p
            b <i>Melts in Your Heart, Not in Your Eyes</i>
          p Join more than 70 thousand delighted customers sharing good Fancy in over 130 different countries!
          p Not fully Fancy Crazy with your products?
            br
            | No worries! We've got it covered.
          p +1 914-598-8976 | support@fancycrazy.com
    product-reviews.mt-5
    fragment-recently-products.mt-5
    similar-products(:product-id="product.id").mt-5
</template>
<script>
  import productModule from '@/js/store/page-product';
  import FragmentVariants from '@/js/fragments/product__Variants';
  import FragmentImageList from '@/js/fragments/product__ImageList';
  import IMG_SECURE_PAYMENT from '@/images/mcafee.png';
  import {addToCart} from "@/js/components/mixins/addToCart";
  import {mapGetters, mapState} from 'vuex';
  import FragmentExpandable from "@/js/fragments/product__Expandable";
  import {Magnifier} from "@/js/plugins";
  import {GLOBAL_EVENTS} from "@/js/plugins";
  import FragmentRecentlyProducts from '@/js/fragments/index__RecentlyProducts'
  import SimilarProducts from '@/js/fragments/product__SimilarProducts'
  import ProductReviews from '@/js/fragments/product__Reviews'

  export default {
    storeModule: ['pageProduct', productModule],
    mixins: [addToCart],
    components: {
      Magnifier,
      FragmentVariants,
      FragmentImageList,
      FragmentExpandable,
      FragmentRecentlyProducts,
      SimilarProducts,
      ProductReviews
    },
    data() {
      return {
        IMG_SECURE_PAYMENT,
        BTN_TITLE: 'BUY IT NOW!',
        MOBILE_TOGGLE_ADD_TO_CART: false
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
        if ((!this.IS_VARIANT_AVAILABLE) || (this.$mq.phone)) {
          cls.push(...[bs.roundedTop, bs.mt2]);
        }
        if (/^ADD/.test(this.BTN_TITLE))
          cls.push(bs.disabled);
        return cls;
      },
      ADD_TO_CART_OUTER_SCROLL() {
        if (!this.$mq.phone) return {};
        const percentage = (100 - this.MOBILE_TOGGLE_ADD_TO_CART * 100) + '%';
        return {
          'transform': `translateY(${percentage})`,
          '-webkit-transform': `translateY(${percentage})`
        }
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
    async mounted() {
      this.$appStore.subscribe(mutation => {
        if (mutation.type === 'cart/addToCart') {
          this.$appStore.commit('cart/togglePopup');
        }
      });
      if (this.$mq.phone) {
        document.getElementById('scroll').style.paddingBottom = '60px';
        GLOBAL_EVENTS.$on('scroll', value => {
          this.MOBILE_TOGGLE_ADD_TO_CART = value;
        })
      }
      await Promise.all([
        this.$store.dispatch('addToRecently', this.product.handle),
        this.$store.dispatch('pageProduct/initial')
      ]);
    }
  };
</script>
