<style lang="scss" module>
  @import "../../scss/inc";
  .imgThumbnail {
    padding: .3rem;
    :global(.ratio-1-1){
      border: 2px solid $gray-200;
    }
    :global(.content) {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: .7rem;
    }
  }

  .img {
    height: 100%;
  }
</style>
<template lang="pug">
  slider
    a(v-for="image in images", :key="image", :class="$style.imgThumbnail")
      .ratio-1-1
        .content
          img(:src="image | shopifyImgUrl", :class="$style.img")
</template>
<script>
  import {mapState} from 'vuex';
  import {Slider} from "@/js/components";

  export default {
    components: {Slider},
    data: () => ({
      options: {
        slidesToShow: 3
      }
    }),
    computed: {
      ...mapState({
        images: state => state.pageProduct.product.images
      })
    }
  };
</script>
