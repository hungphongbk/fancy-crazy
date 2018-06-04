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

  .slider.top {
    padding-top: 20px;
  }

  :global(.flickity-page-dots) :local {
    .slider.no-page-dots & {
      display: none;
    }
    .slider.top & {
      bottom: unset;
      top: -10px;
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
  div(:class="SLIDER_CLASSES")
    flickity(ref="flkty", :options="options", v-show="!ORIENTATION_VERTICAL_SHOW")
      slot
    vertical-duplicator(v-if="ORIENTATION_VERTICAL_SHOW")
</template>
<script>
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
      SLIDER_CLASSES() {
        const $style = this.$style,
          rs = [$style.slider, $style[this.theme]];
        if (this.narrow)
          rs.push($style.narrow);
        if (this.options.pageDots === false)
          rs.push($style.noPageDots);
        else if (typeof this.options.pageDots === 'string')
          rs.push($style[this.options.pageDots]);

        return rs;
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
      require('flickity-imagesloaded');
    }
  }
</script>
