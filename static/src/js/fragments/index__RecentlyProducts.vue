<template lang="pug">
  div(v-if="products.length>0")
    .text-center
      h4 RECENTLY VIEWED PRODUCTS
      hr
    .row
      div(v-for="product in products", :class="classes")
        product-item(:product="product")
</template>
<script>
  import {ProductItem} from "@/js/components";

  export default {
    components: {ProductItem},
    data() {
      return {
        products: this.$store.state.recently,
        classes: [
          this.$bs.col6,
          this.$bs.colSm4
        ]
      }
    }
  }
</script>
