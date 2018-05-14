<style lang="scss" module>
  @import "../../scss/inc";

  .item {
    width: percentage(1/3);
  }

  .title {
    font-weight: 700;
    color: $theme-red;
  }
  .thumbnail{
    flex-basis: 25%;
  }
  .content {
    flex-basis: 75%;
  }
  .author{
    font-weight: 700;
  }
</style>
<template lang="pug">
  .mx-3
    slider(type="flickity", :opts="opts")
      .px-2(:class="$style.item", v-for="item in items")
        star-rating.mb-2(:rating="item.rating", :star-size="40", :show-rating="false")
        h5(:class="$style.title") {{item.review_title}}
        .d-flex.mt-2
          .ratio-1-1(:class="$style.thumbnail")
            .content
              img.img-fluid(:src="item.image_url")
          .pl-2.pr-4(:class="$style.content")
            p
              i.text-muted {{item.review_content}}
            h6(:class="$style.author") {{item.review_customer_name}}
</template>
<script>
  import {Slider} from "@/js/components";
  import StarRating from 'vue-star-rating'

  export default {
    components: {Slider, StarRating},
    props: {
      items: {
        type: Array,
        required: true
      }
    },
    data: () => ({
      opts: {
        infinite: true
      }
    })
  }
</script>
