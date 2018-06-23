<style lang="scss" module>

</style>
<template lang="pug">
  div
    .text-center
      h4 CUSTOMER REVIEWS
      hr
    form
      .mb-3.d-flex.align-items-center.justify-content-between
        h5.mb-0 WRITE A REVIEW
        star-rating.d-inline-block(:star-size="$mq.phone?25:30", :show-rating="false", v-model="form.rating")
      .form-group
        input.form-control(placeholder="Enter your name" v-model="form.review_customer_name")
      .form-group
        input.form-control(placeholder="Review title" v-model="form.review_title")
      .form-group
        textarea.form-control(placeholder="How was your overall experience using this item?" v-model="form.review_content" rows="4")
</template>
<script>
  import {get} from "@/js/plugins/ajax";
  import StarRating from 'vue-star-rating'

  export default {
    components: {StarRating},
    data: () => ({
      form: {
        review_customer_name: '',
        review_title: '',
        review_content: '',
        rating: 3.5
      }
    }),
    computed: {
      PRODUCT_ID() {
        return this.$store.state.pageProduct.product.id;
      }
    },
    async mounted() {
      const data = await get('http://localhost:5000/fancycrazy-895ba/us-central1/s/reviews/products/' + this.PRODUCT_ID);
      console.log(data);
    }
  }
</script>
