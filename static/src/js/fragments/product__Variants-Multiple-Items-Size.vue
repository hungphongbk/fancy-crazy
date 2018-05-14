<style lang="scss" scoped>
  @import "../../scss/inc";
</style>
<template lang="pug">
  div
    .clearfix
      p.product-variants-label.float-left PICK YOUR SIZE:
      p.product-variants-label.float-right(v-if="hasSizeChart")
        a(href="#", @click="currentSizeChart = 0")
          | VIEW SIZE CHARTS
          fa-icon.ml-1(:icon="AngleRight", size="lg")
    dl.d-flex.flex-wrap
      div(v-for="item in items")
        .btn.mr-2.mb-2(:class="item.title===value.title?$bs.btnOutlineThemeRed:$bs.btnOutlineSecondary", @click="$emit('input', item)") {{item.title}}
    vue-gallery(:images="sizeCharts | shopifyImgUrls('master')", :index="currentSizeChart", @close="currentSizeChart = null")
</template>
<script>
  import AngleRight from '@fortawesome/fontawesome-free-solid/faAngleRight'
  import mixin from './product__Variants-Multiple-Items-mixins'
  import VueGallery from 'vue-gallery'

  export default {
    mixins: [mixin],
    components: {
      VueGallery
    },
    data() {
      return {
        AngleRight,
        currentSizeChart: null
      }
    },
    computed: {
      sizeCharts() {
        return this.$store.getters['pageProduct/sizecharts']
      },
      hasSizeChart() {
        return this.sizeCharts.length && this.sizeCharts.length > 0;
      }
    }
  }
</script>
