<style lang="scss" module>
  @import "../../scss/inc";

  $img-width: 0.23;

  .item {
    width: percentage(1/3);
    height: 30vh
  }

  .title {
    font-weight: 700;
    color: $theme-red;
  }

  .thumbnail {
    flex-basis: percentage($img-width);
  }

  .content {
    flex-basis: percentage(1-$img-width);
    p {
      text-align: justify;
      @include font-size-with-line-height($font-size-base*0.92);
    }
  }

  .author {
    font-weight: 700;
  }
</style>
<template lang="pug">
  .mx-3
    slider(type="flickity", :opts="opts", theme="dark")
      .px-2(:class="$style.item", v-for="item in items")
        .d-flex.justify-content-between.mb-2.mr-4
          star-rating(:rating="item.rating", :star-size="40", :show-rating="false", :read-only="true")
          span.mr-6.mt-3
            //span.d-inline-block
            fa-icon.mr-2(:icon="faClock")
            span {{item.review_date}}
        h5(:class="$style.title") {{item.review_title}}
        .d-flex.mt-2
          .ratio-1-1(:class="$style.thumbnail")
            .content
              img.img-fluid(:src="item.image_url | shopifyImgUrl")
          .pl-2.pr-4(:class="$style.content")
            p
              i.text-muted {{item.review_content}}
            h6(:class="$style.author") {{item.review_customer_name}}
</template>
<script>
  import {Slider} from "@/js/components";
  import StarRating from 'vue-star-rating'
  import faClock from "@fortawesome/fontawesome-free-regular/faClock"

  export default {
    components: {Slider, StarRating},
    props: {
      items: {
        type: Array,
        required: true
      }
    },
    data: () => ({
      faClock,
      opts: {
        infinite: true
      }
    })
  }
</script>
