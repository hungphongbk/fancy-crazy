<style lang="scss" module>
  @import "../../scss/inc";

  .img-thumbnail {
    padding: .3rem;
    width: percentage(1/3);
    @at-root .inner {
      border: 2px solid $gray-200;
      transition: border $animation-time*2/3 ease;
      &.selected {
        border-color: $theme-red;
      }
    }
    @at-root .content {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: .7rem;
      overflow: hidden;
    }
  }

  .img {
    height: 100%;
  }

  @include media-breakpoint-down(sm) {
    .img-thumbnail {
      padding: .15rem;
      @include reset-link {
        display: block;
      }
      width: 100%;
    }
    .inner {
      border-color: rgba(#fff, 0)
    }
    .content {
      padding: .3rem;
    }
    .slider {
      height: 75vw;
    }
  }
</style>
<template lang="pug">
  slider(:narrow="true", theme="dark", ref="slider", :orientation="(!$mq.phone)?'horizontal':'vertical'", :class="$style.slider")
    a(v-for="(image,index) in PRODUCT_IMAGES", :key="image", :class="$style.imgThumbnail")
      .ratio-1-1(:class="{ [$style.inner]:true, [$style.selected]: (SELECTED_IMAGE===image) }", @click="select(index)")
        .content(:class="$style.content")
          img(:src="image | shopifyImgUrl('medium')", :class="$style.img")
</template>
<script>
  import {createNamespacedHelpers} from 'vuex';
  import {Slider} from "@/js/components";

  const {mapGetters} = createNamespacedHelpers('pageProduct');

  export default {
    components: {Slider},
    data: () => ({
      options: {
        slidesToShow: 3
      }
    }),
    computed: {
      ...mapGetters({
        PRODUCT_IMAGES: 'images',
        SELECTED_IMAGE: 'selectedImage'
      }),
      /**
       * @return {boolean}
       */
      IS_VERTICAL() {
        return this.$mq.phone
      }
    },
    methods: {
      select(index) {
        this.$appStore.commit('pageProduct/selectImage', {index});
      }
    },
    mounted() {
      this.$appStore.subscribe(mutation => {
        if (mutation.type === 'pageProduct/selectImage') {
          const index = this.PRODUCT_IMAGES.findIndex(i => i === this.SELECTED_IMAGE);
          if (this.$refs.slider)
            this.$refs.slider.select(index)
        }
      })
    }
  };
</script>
