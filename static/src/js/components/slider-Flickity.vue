<style lang="scss" module>
  @import "../../scss/inc";

  $size: 4rem;

  @mixin hover($color) {
    box-shadow: 0 0 0 0 $color;
    &:hover, &:focus {
      outline: none;
      box-shadow: 0 0 0 4px $color;
    }
  }

  .slider :global {
    .flickity-prev-next-button {
      width: $size;
      height: $size;
      border-radius: 50%;

      transition: all $animation-time ease;
    }
  }

  .light :global .flickity-prev-next-button {
    background: rgba(#fff, .9) !important;

    @include hover(rgba(lighten($theme-red, 7%), .65))
  }

  .dark :global .flickity-prev-next-button {
    background: rgba($theme-red, .85) !important;

    @include hover(lighten($theme-red, 45%));
    .flickity-button-icon {
      fill: white;
    }
  }

  .narrow :global .flickity-viewport {
    //margin: {
    //  left: $size*5/4;
    //  right: $size*5/4;
    //}
  }
</style>
<template lang="pug">
  div(:class="[$style.slider, $style[theme], narrow?$style.narrow:'']")
    flickity(ref="flkty", :options="options")
      slot
</template>
<script>
  import 'flickity-imagesloaded'
  import Flickity from 'vue-flickity'

  export default {
    components: {Flickity},
    props: {
      opts: {
        type: Object,
        default: () => ({})
      },
      theme: {
        type: String,
        default: 'light'
      },
      narrow: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        slickOpts: {
          imagesLoaded: true,
          percentPosition: false,
          wrapAround: true,
          pageDots: false
        }
      }
    },
    computed: {
      options() {
        return Object.assign({}, this.slickOpts, this.opts);
      }
    },
    methods: {
      select(index) {
        this.$refs.flkty.select(index);
      }
    }
  }
</script>
