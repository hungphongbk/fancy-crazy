<style lang="scss" module>
  @import "../../scss/inc";

  @mixin hover($color) {
    box-shadow: 0 0 0 0 $color;
    &:hover, &:focus {
      outline: none;
      box-shadow: 0 0 0 4px $color;
    }
  }

  .slider :global {
    .flickity-prev-next-button {
      @include size(4rem);
      @include media-breakpoint-down(sm) {
        @include size(2.3rem);
      }
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

  .vertical {
    height: 100%;
    max-height: 100%;
    overflow-y: scroll;
  }
</style>
<template lang="pug">
  div(:class="[$style.slider, $style[theme], narrow?$style.narrow:'']")
    flickity(ref="flkty", :options="options", v-show="!ORIENTATION_VERTICAL_SHOW")
      slot
    vertical-duplicator(v-if="ORIENTATION_VERTICAL_SHOW")
</template>
<script>
  import 'flickity-imagesloaded'
  import Flickity from 'vue-flickity'

  export default {
    components: {
      Flickity,
      VerticalDuplicator: {
        functional: true,
        render: (h, {parent}) => h('div', {class: parent.$style.vertical}, parent.$slots.default)
      }
    },
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
      },
      orientation: {
        type: String,
        default: 'horizontal'
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
      },
      /**
       * @return {boolean}
       */
      ORIENTATION_VERTICAL_SHOW() {
        return this.orientation === 'vertical'
      }
    },
    methods: {
      select(index) {
        this.$refs.flkty.select(index);
      }
    },
    mounted() {
      // debugger;
    }
  }
</script>
