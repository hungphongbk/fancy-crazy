<template lang="pug">
  div(v-if="products.length>0")
    .text-center
      h4 RECENTLY VIEWED PRODUCTS
      hr
    data-source(:dataSource="products", type="slider")
        product-item(slot-scope="{item}", :product="item")
</template>
<script>
  import {ProductItem, DataSource} from "@/js/components";

  export default {
    components: {ProductItem, DataSource},
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
