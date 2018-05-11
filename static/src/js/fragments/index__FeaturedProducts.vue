<style lang="scss" scoped>
  .index-featured-products {
    display: flex;
    flex-wrap: wrap;
  }
</style>
<template lang="pug">
  .row
    div(v-for="product in products", :class="classes")
      product-item(:product="product")
</template>
<script>
  import wrap from '@/js/components/ProductItemWrap'
  import {ProductItem} from "@/js/components";

  export default {
    components: {ProductItem},
    props: {
      index: {
        type: Number,
        required: true
      },
      columns: {
        type: Number,
        default: 4
      }
    },
    data() {
      return {
        products: this.$store.state.pageIndex.featuredProducts[this.index],
        classes: ['col-md-' + (this.columns === 4 ? 3 : 4)]
      }
    }
  }
</script>
