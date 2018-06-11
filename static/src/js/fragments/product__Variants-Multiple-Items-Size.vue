<style lang="scss" module>
  @import "../../scss/inc";

  .container :global {
    .blueimp-gallery > .close {
      color: white;

      @include media-breakpoint-down(sm){
        height: 50px;
        width: 50px;
        display: inline-block;
        line-height: 50px;
        margin: -5px;
        padding: 0;
        text-align: center;
        border-radius: 50%;
        background-color: white;
        color: black;
        opacity:1;
        box-shadow: 0px 0px 10px -2px rgba(0,0,0,0.75);
      }
    }
  }

  .label {
    composes: label from 'sass-loader!./product__Variants-Multiple-Items__share.m-scss'
  }

  .item {
    composes: item from 'sass-loader!./product__Variants-Multiple-Items__share.m-scss'
  }

  .selected {

  }
</style>
<template lang="pug">
  div(:class="$style.container")
    .clearfix
      p.float-left(:class="$style.label") PICK YOUR SIZE:
      p.float-right(:class="$style.label", v-if="hasSizeChart")
        a(href="#", @click="CURRENT_SIZE_CHART = 0")
          | VIEW SIZE CHARTS
          fa-icon.ml-1(:icon="FA_ANGLE_RIGHT", size="lg")
    dl.d-flex.flex-wrap
      div(v-for="item in items")
        .btn.mr-1.mb-1(:class="[ $style.item, item.title===value.title?$bs.btnThemeRed:$bs.btnOutlineSecondary, item.title===value.title?$style.selected:'']", @click="$emit('input', item)") {{item.title}}
    vue-gallery(:images="sizeCharts | shopifyImgUrls('master')", :index="CURRENT_SIZE_CHART", @close="CURRENT_SIZE_CHART = null")
</template>
<script>
  import FA_ANGLE_RIGHT from '@fortawesome/fontawesome-free-solid/faAngleRight'
  import mixins from './product__Variants-Multiple-Items-mixins'
  import VueGallery from 'vue-gallery'
  import {GLOBAL_EVENTS} from "@/js/plugins";

  export default {
    mixins: [mixins],
    components: {
      VueGallery
    },
    data() {
      return {
        FA_ANGLE_RIGHT,
        CURRENT_SIZE_CHART: null
      }
    },
    computed: {
      sizeCharts() {
        return this.$store.getters['pageProduct/sizecharts']
      },
      hasSizeChart() {
        return this.sizeCharts.length && this.sizeCharts.length > 0;
      }
    },
    watch: {
      CURRENT_SIZE_CHART(value) {
        GLOBAL_EVENTS.$emit('vue-gallery-toggle', value !== null);
      }
    }
  }
</script>
