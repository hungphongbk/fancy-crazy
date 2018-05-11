<style lang="scss" module>
  @import "../../scss/inc";

  $size: 7rem;
</style>
<template lang="pug">
  div(:class="$style.slider")
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
