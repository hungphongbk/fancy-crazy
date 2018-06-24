<template lang="pug">
  div(v-if="products.length>0")
    .text-center
      h4 RELATED PRODUCTS
      hr
    data-source(:dataSource="products", type="slider")
      product-item(slot-scope="{item}", :product="item")
</template>
<script>
  import {ProductItem, DataSource} from "@/js/components";
  import {get} from "@/js/plugins/ajax";

  export default {
    components: {ProductItem, DataSource},
    props: {
      productId: {
        type: Number | String,
        required: true
      }
    },
    data() {
      return {
        products: []
      }
    },
    async mounted() {
      this.products = await get(`https://us-central1-fancycrazy-895ba.cloudfunctions.net/s/products/${this.productId}/similar`);
    }
  }
</script>
