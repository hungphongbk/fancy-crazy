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
</style>
<template lang="pug">
  div(:class="[$style.slider, $style[theme]]")
    flickity(ref="slick", :options="options")
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
    }
  }
</script>
