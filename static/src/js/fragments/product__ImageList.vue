<style lang="scss" module>
  @import "../../scss/inc";

  .imgThumbnail {
    padding: .3rem;
    width: percentage(1/3);
    @at-root .inner {
      border: 2px solid $gray-200;
      &.selected {
        border-color: $theme-red;
      }
    }
    @at-root .content {
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
  slider(:narrow="true", theme="dark", ref="slider")
    a(v-for="(image,index) in PRODUCT_IMAGES", :key="image", :class="$style.imgThumbnail")
      .ratio-1-1(:class="{ [$style.inner]:true, [$style.selected]: (SELECTED_IMAGE===image) }", @click="select(index)")
        .content(:class="$style.content")
          img(:src="image | shopifyImgUrl", :class="$style.img")
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
      })
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
          this.$refs.slider.select(index)
        }
      })
    }
  };
</script>
