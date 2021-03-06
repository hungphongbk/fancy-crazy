<style lang="scss" module>
  @import "../../../scss/inc";

  %transition {
    transition: all $animation-time ease;
  }

  .cart {
    display: inline-grid;
    position: relative;
  }

  .cart-thumb {
    cursor: pointer;
    transform: scale(1.36);
    border-radius: 50%;
    //background-color: $gray-200;
    z-index: 1;
    width: 2.2rem;

    @at-root .count {
      position: absolute;
      top: -.3rem;
      right: -.3rem;
      font-size: .9rem;
      width: 1.3rem;
      height: 1.3rem;
      text-align: center;
      border-radius: 50%;
      color: white;
      background: #8a96a8;
      @extend %transition;
      .cart-thumb:hover & {
        background: desaturate(lighten($theme-red, 20%), 25%);
      }

      .loading {
        line-height: 1.3;
        vertical-align: baseline;
      }
    }
    @at-root .icon {
      @extend %transition;
      .cart-thumb:hover & {
        color: $theme-red;
      }

    }
  }

  .cart-panel {
    position: absolute;
    top: 100%;
    right: 0;
    width: 35vw;
    margin-top: .7rem;
    border-top: 4px solid $green;
    &:global(.mobile) {
      margin-top: 0;
      border: none;
    }
  }

  .cart-item {
    img {
      width: 64px;
    }

    @at-root .title {
      flex-grow: 1;
    }
    @at-root .remove {
      display: inline-block;
    }
  }

  .cart-empty {
    img {
    }
  }

  .summary {
    width: 100%;
    tr td:nth-child(2) {
      text-align: right;
    }
    &-subtotal {
      font-weight: 600;
      font-size: 1.12em;
    }
    &-regular {
      color: lighten($theme-red, 15%)
    }
  }

  .secure {
    margin-left: -10px;
    margin-right: -10px;
    margin-bottom: -15px;
    width: calc(100% + 20px) !important;
  }

  @include media-breakpoint-down(sm) {
    .cart {
      display: flex;
    }
    .cart-thumb {
      transform: scale(1.125) translateY(.3rem) translateX(-.6rem);
    }
    .cart-panel {
      width: unset;
    }
    .cart-item img {
      width: 56px;
    }
    .title {
      &-outer {
        font-size: .9rem;
      }
      + span {
      }
    }
  }
</style>
<template lang="pug">
  div(:class="$style.cart")
    a.ratio-1-1.ml-2(:class="$style.cartThumb", @click="toggle")
      .content.d-flex.justify-content-center.align-items-center
        fa-icon(:icon="CartIcon", size="large", :class="$style.icon")
        span(:class="$style.count")
          fa-icon(v-if="isLoading", :class="$style.loading", :icon="SyncIcon", spin, size="xs")
          template(v-else) {{CART_COUNT}}
    modal(:class="$style.cartPanel", :show="SHOW_POPUP", :backdrop="$mq.phone")
      form(v-if="CART_ITEMS.length>0", action="/cart" method="post" novalidate)
        .media.mb-2(v-for="item in CART_ITEMS", :class="$style.cartItem", :key="item.key")
          img.mr-2(:src="item.image | shopifyImgUrl($mq.phone?'small':'compact',false)")
          .media-body
            h6.d-flex(:class="$style.titleOuter")
              span(:class="$style.title")
                span {{item.product_title}}
                br
                span.small(:class="") {{item.variant_title}}
              span
                price.pl-4(:class="$style.price", :prices="item.prices", :has-sale="false", :from-label="false")
                br
                span.d-flex.flex-row.mt-2.justify-content-end
                  counter.input-group-sm(:value="item.quantity", @input="quantity => change({id: item.id, quantity})")
                  .btn.btn-danger.btn-sm.ml-1(:class="$style.remove", @click="remove({id: item.id})")
                    fa-icon(:icon="TimesIcon" style="color: white", size="xs")
        hr
        table(:class="$style.summary")
          tr(:class="$style.summarySubtotal")
            td
              span Subtotal
            td
              span {{TOTAL_SUB | usd}}
          tr(:class="$style.summaryRegular")
            td
              span Regular Total
            td
              span <del>{{TOTAL_REGULAR | usd}}</del>
          tr
            td
              span.text-success Total Saving
            td
              span.text-success {{TOTAL_SAVING | usd}}
        input.btn.btn-lg.btn-success.w-100.mt-3(type="submit", name="checkout", value="PROCEED TO CHECKOUT")
      div(v-else)
        .text-center.mt-4.mb-2
          img.w-25.d-inline-block(src="@/images/empty-cart-edited.svg")
          h5.mt-3 Your cart is empty
          p.text-muted.mt-2.mb-3 Looks like you haven't made your choice yet...
      .btn.btn-lg.btn-outline-theme-red.w-100.mt-2(@click="toggle") CONTINUE SHOPPING
      img(:class="$style.secure", src="@/images/mcafee.png")
</template>
<script>
  import {cartMixin} from "@/js/components/mixins/cart";
  import CartIcon from '@fortawesome/fontawesome-free-solid/faShoppingCart';
  import TimesIcon from '@fortawesome/fontawesome-free-solid/faTimes';
  import SyncIcon from '@fortawesome/fontawesome-free-solid/faSync';
  import Modal from '@/js/components/universal/modal';
  import {createNamespacedHelpers} from 'vuex';

  const {mapState, mapGetters, mapActions} = createNamespacedHelpers('cart');

  export default {
    name: "Cart",
    mixins: [cartMixin],
    components: {
      Modal
    },
    data() {
      return {
        CartIcon,
        TimesIcon,
        SyncIcon
      };
    },
    computed: {
      ...mapState({
        CART_COUNT: state => state.count,
        CART_ITEMS: state => state.items,
        SHOW_POPUP: state => state.showPopup,
        isLoading: state => state.isLoading
      }),
      ...mapGetters({
        TOTAL_REGULAR: 'totalRegular',
        TOTAL_SUB: 'totalSub',
        TOTAL_SAVING: 'totalSaving'
      })
    },
    methods: {
      ...mapActions({
        remove: 'removeItem',
        change: 'changeItem'
      }),
      toggle() {
        this.$store.commit('cart/togglePopup');
      }
    }
  };
</script>
