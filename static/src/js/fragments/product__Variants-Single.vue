<template lang="pug">
  div.product-variants(v-if="IS_VARIANT_AVAILABLE")
    p
      span.text-theme-red {{value.title}}
    ul
      li(v-for="item in list", :class="{'selected': item===value, 'disabled': !item.available}", @click="select(item)")
        thumbnail.no-effect.ratio-1-1(:url_="item.image", :overlay_="false", v-tooltip.top="item.title",:lazy_="false")
</template>
<script>
  import {mapState} from 'vuex';

  export default {
    computed: {
      ...mapState({
        list: state => state.pageProduct.product.variants,
        value: state => state.pageProduct.selected
      }),
      IS_VARIANT_AVAILABLE() {
        return this.$store.getters['pageProduct/isVariantAvailable'];
      }
    },
    methods: {
      select(item) {
        // noinspection JSIgnoredPromiseFromCall
        this.$appStore.dispatch('pageProduct/select', {variantId: item.id});
      }
    }
  };
</script>
