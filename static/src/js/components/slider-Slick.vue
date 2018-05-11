<style lang="scss" module>
  @import "../../scss/inc";

  $size: 7rem;

  .slider {
    position: relative;
    :global .slick-arrow {
      display: none !important;
    }
  }

  .prev, .next {
    position: absolute;
    height: $size;
    top: calc(50% - #{$size/2});
    vertical-align: middle;
    font-size: 5rem;
    line-height: 5rem;
    display: inline-block;
    width: $size/2;
    background-color: rgba(#888, .3);
    text-align: center;
    cursor: pointer;
    transition: all .25s ease;
    opacity: 0;
    transform: scale(.7);
    &:before {
      content: "";
      display: inline-block;
      height: 100%;
      vertical-align: middle;
    }
    &:hover {
      opacity: 1;
      transform: scale(1.1);
    }
  }

  .prev {
    left: -$grid-gutter-width/2;
    border-top-right-radius: $size/2;
    border-bottom-right-radius: $size/2;
    transform-origin: left center;
  }

  .next {
    right: -$grid-gutter-width/2;
    border-top-left-radius: $size/2;
    border-bottom-left-radius: $size/2;
    transform-origin: right center;
  }
</style>
<template lang="pug">
  div(:class="$style.slider")
    slick(ref="slick", :options="slickOpts")
      slot
    span(:class="$style.prev", @click="prev") &#x2039;
    span(:class="$style.next", @click="next") &#x203a;
</template>
<script>
  import Slick from 'vue-slick'

  export default {
    components: {Slick},
    props: {
      opts: {
        type: Object,
        default: () => ({})
      }
    },
    data() {
      return {
        slickOpts: {
          slidesToShow: 4,
          prevArrow: this.$refs['prev'],
          nextArrow: this.$refs['next']
        }
      }
    },
    computed: {
      options() {
        return Object.assign({}, this.slickOpts, this.opts);
      }
    },
    methods: {
      next() {
        this.$refs.slick.next();
      },
      prev() {
        this.$refs.slick.prev();
      }
    }
  }
</script>
