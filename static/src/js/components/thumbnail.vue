<style lang="scss" scoped="">
  @import "../../scss/inc";

  .thumb {
  }

  img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    will-change: transform;
    transition: transform $animation-time ease-in;
    transform: scale(1);
    .thumb:not(.no-effect):hover & {
      transform: scale(1.12);
    }
  }

  .overlay {
    $thumb-size: 60px;

    background-color: rgba(0, 0, 0, 0.65);
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;

    //@extend %abs-full;
    transition: opacity $animation-time ease-in;
    opacity: 0;

    .thumb-items {
      > span {
        color: white;
        background-color: rgba(255, 255, 255, 0.31);
        font-size: $thumb-size/2.4;
        width: $thumb-size;
        height: $thumb-size;
        line-height: $thumb-size;
        border-radius: 50%;
        &:not(last-child) {
          margin-right: 5px;
        }
      }

      transition: transform $animation-time ease-out;
      transform: scale(1.3);
    }

    .thumb:hover & {
      opacity: 1;
      .thumb-items {
        transform: scale(1);
      }
    }
  }
</style>
<template lang="pug">
  .vth-thumb.thumb(:class="ratio_?`ratio-${ratio_}`:''")
    wrapper
      img(v-if="url_ && slickLazy_", :data-lazy="url_", :alt="alt_")
      img.lazy(v-else-if="url_ && lazy_", v-lazy="lazyUrl_", :alt="alt_")
      img(v-else-if="url_", :src="lazyUrl_", :alt="alt_")
      img(v-else, :src="demo_")
      .overlay(v-if="overlay_")
        .thumb-items
          slot(name="overlay")
            //span.fa.fa-search
    slot
</template>
<script>
  export default {
    components: {
      Wrapper: {
        functional: true,
        render(h, {parent, slots}) {
          // console.log(parent)
          const children = slots().default;
          //   notHasRatio = !(parent.ratio_) ;
          // if (notHasRatio) return children;
          return (<div class="content">{children}</div>);
        }
      }
    },
    props: {
      url_: String,
      alt_: String,
      ratio_: String,
      overlay_: {
        type: Boolean,
        default: true
      },
      slickLazy_: {
        type: Boolean,
        default: false
      },
      lazy_: {
        type: Boolean,
        default: true
      },
      thumbnailSize_: String,
      type: {
        type: String,
        default: 'haravan'
      }
    },
    data() {
      return {
      };
    },
    computed: {
      lazyUrl_() {
        const {url_} = this;
        if (!this.thumbnailSize_) return url_;
        return url_.replace(/_master(\.[A-Za-z]*)$/, `_${this.thumbnailSize_}$1`);
      }
    }

  };
</script>
