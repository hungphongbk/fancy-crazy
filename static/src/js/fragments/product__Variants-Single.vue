<style lang="scss" scoped>
  @import "../../scss/inc";
</style>
<template lang="pug">
  div.product-variants(v-show="isVariantAvailable")
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
      isVariantAvailable() {
        return this.$store.getters['pageProduct/isVariantAvailable'];
      }
    },
    methods: {
      select(item) {
        this.$store.commit('pageProduct/select', {variantId: item.id});
      }
    }
  };
</script>
