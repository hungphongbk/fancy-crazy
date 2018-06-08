<style lang="scss" module>
  @import "../../scss/inc";

  $img-width: 0.23;

  .item {
    width: percentage(5/7);
    height: 35vh;
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

  @include media-breakpoint-down(sm) {
    .timestamp {
      @include font-size-with-line-height($font-size-base*.85);
      color: $gray-600;
      margin-top: .19rem;
    }
    .title {
      @include font-size-with-line-height($h6-font-size);
    }
    .content p{
      @include font-size-with-line-height($font-size-base*0.74);
    }
  }

  @include media-breakpoint-up(sm) {
    .item {
      width: percentage(1/3);
      height: 30vh;
    }
  }
</style>
<template lang="pug">
  .mx-3
    .d-flex.align-items-center
      star-rating.d-inline-block(:rating="REVIEW_POINT", :star-size="$mq.phone?15:20", :show-rating="false", :read-only="true")
      .d-inline-block.ml-2 {{items.length}} Reviews
    hr
    slider(type="flickity", :opts="opts", theme="dark")
      .px-2(:class="$style.item", v-for="item in items")
        .d-flex.justify-content-between.mb-2.mr-sm-4
          star-rating(:rating="item.rating", :star-size="$mq.phone?15:30", :show-rating="false", :read-only="true")
          span.mr-sm-6.mt-sm-3(:class="$style.timestamp")
            //span.d-inline-block
            fa-icon.mr-2(:icon="faClock")
            span {{item.review_date}}
        h5(:class="$style.title") {{item.review_title}}
        .d-flex.mt-2
          .ratio-1-1(:class="$style.thumbnail")
            .content
              img.img-fluid(:data-flickity-lazyload="item.image_url | shopifyImgUrl('medium')")
          .pl-2.pr-1.pr-sm-4(:class="$style.content")
            p
              i.text-muted {{item.review_content}}
            h6(:class="$style.author") {{item.review_customer_name}}
</template>
<script>
  import {Slider} from "@/js/components";
  import StarRating from 'vue-star-rating'
  import faClock from "@fortawesome/fontawesome-free-regular/faClock"
  import sum from "lodash/sum";

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
        infinite: true,
        lazyLoad: 2
      }
    }),
    computed: {
      /**
       * @return {number}
       */
      REVIEW_POINT() {
        return (sum(this.items.map(i => i.rating)) / this.items.length).toFixed(1)*1.0;
      }
    }
  }
</script>
