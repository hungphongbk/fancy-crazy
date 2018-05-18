<style lang="scss" module>
  .label{
    composes: label from './product__Variants-Multiple-Items__share.m-scss'
  }
  .item{
    composes: item from './product__Variants-Multiple-Items__share.m-scss'
  }
</style>
<template lang="pug">
  div
    .clearfix
      p.float-left(:class="$style.label") PICK YOUR SIZE:
      p.float-right(:class="$style.label", v-if="hasSizeChart")
        a(href="#", @click="currentSizeChart = 0")
          | VIEW SIZE CHARTS
          fa-icon.ml-1(:icon="AngleRight", size="lg")
    dl.d-flex.flex-wrap
      div(v-for="item in items")
        .btn.mr-1.mb-1(:class="[ $style.item, item.title===value.title?$bs.btnOutlineThemeRed:$bs.btnOutlineSecondary]", @click="$emit('input', item)") {{item.title}}
    vue-gallery(:images="sizeCharts | shopifyImgUrls('master')", :index="currentSizeChart", @close="currentSizeChart = null")
</template>
<script>
  import AngleRight from '@fortawesome/fontawesome-free-solid/faAngleRight'
  import mixins from './product__Variants-Multiple-Items-mixins'
  import VueGallery from 'vue-gallery'

  export default {
    mixins: [mixins],
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
