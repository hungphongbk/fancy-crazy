<style lang="scss" module>
  @import "../../../scss/inc";

  .cart {
    display: inline-grid;
    position: relative;
  }

  .cartThumb {
    border-radius: 50%;
    //background-color: $gray-200;
    z-index: 1;
    width: 2.2rem;

    .count {
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

      .loading {
        line-height: 1.3;
        vertical-align: baseline;
      }
    }
  }

  .cartPanel {
    position: absolute;
    top: 100%;
    right: 0;
    width: 35vw;
    margin-top: .7rem;
    border-top: 4px solid $green;
  }

  .cartItem {
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

  .summary {
    width: 100%;
    tr td:nth-child(2) {
      text-align: right;
    }
  }

  .secure {
    margin-left: -10px;
    margin-right: -10px;
    margin-bottom: -15px;
    width: calc(100% + 20px) !important;
  }
</style>
<template lang="pug">
  div(:class="$style.cart")
    a.ratio-1-1.ml-2(:class="$style.cartThumb", @click="toggle")
      .content.d-flex.justify-content-center.align-items-center
        fa-icon(:icon="CartIcon", size="large")
        span(:class="$style.count")
          fa-icon(v-if="isLoading", :class="$style.loading", :icon="SyncIcon", spin, size="xs")
          template(v-else) {{cartCount}}
    modal(:class="$style.cartPanel", :show="showPopup")
      .media.mb-2(v-for="item in cartItems", :class="$style.cartItem", :key="item.key")
        img.mr-2(:src="item.image")
        .media-body
          h6.d-flex
            span(:class="$style.title")
              span {{item.product_title}}
              br
              span.small {{item.variant_title}}
            span
              price.pl-4(:class="$style.price", :prices="item.prices", :has-sale="false")
              br
              span.d-flex.flex-row.mt-2
                counter.input-group-sm(:value="item.quantity", @input="quantity => change({id: item.id, quantity})")
                .btn.btn-danger.btn-sm.ml-1(:class="$style.remove", @click="remove({id: item.id})")
                  fa-icon(:icon="TimesIcon" style="color: white", size="xs")
      hr
      table(:class="$style.summary")
        tr
          td
            span.text-primary Subtotal
          td
            span.text-primary {{totalSub | usd}}
        tr
          td
            span Regular Total
          td
            span {{totalRegular | usd}}
        tr
          td
            b.text-success Total Saving
          td
            b.text-success {{totalSaving | usd}}
      .btn.btn-lg.btn-success.w-100.mt-3 PROCEED TO CHECKOUT
      img(:class="$style.secure", :src="imgSecurePayment")
</template>
<script>
  import {cartMixin} from "@/js/components/mixins/cart";
  import CartIcon from '@fortawesome/fontawesome-free-solid/faShoppingCart';
  import TimesIcon from '@fortawesome/fontawesome-free-solid/faTimes';
  import SyncIcon from '@fortawesome/fontawesome-free-solid/faSync';
  import Modal from '@/js/components/desktop/modal';
  import {mapActions, mapGetters, mapState} from 'vuex';
  import imgSecurePayment from '@/images/mcafee.png';

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
        SyncIcon,
        imgSecurePayment
      };
    },
    computed: {
      ...mapState({
        cartCount: state => state.cart.count,
        cartItems: state => state.cart.items,
        showPopup: state => state.cart.showPopup,
        isLoading: state => state.cart.isLoading
      }),
      ...mapGetters({
        totalRegular: 'cart/totalRegular',
        totalSub: 'cart/totalSub',
        totalSaving: 'cart/totalSaving'
      })
    },
    methods: {
      ...mapActions({
        remove: 'cart/removeItem',
        change: 'cart/changeItem'
      }),
      toggle() {
        this.$store.commit('cart/togglePopup');
      }
    }
  };
</script>
