<style lang="scss" scoped>
  @import "../../scss/inc";

  .product-variants-item {
    height: 2.3rem;
    width: 2.3rem;
    display: inline-block;

    &:before {
      transition: all .25s ease;
    }
    @include outline();
    &.selected {
      @include outline(2px, #FF4136);
    }
  }

  .product-variants-label {
    line-height: 2.3;
  }
</style>
<template lang="pug">
  .d-flex
    p.product-variants-label.mr-3 COLOR:
    dl.clearfix
      dd.product-variants-item.rounded-circle.mr-4.float-left(v-for="item in items",
      :class="{'selected': item.title===value.title}",
      @click="$emit('input', item)",
      :style="{'background-color': colors[item.title.toLowerCase()]}",
      v-tooltip="item.title")
</template>
<script>
  import mixin from './product__Variants-Multiple-Items-mixins'

  export default {
    mixins: [mixin],
    data() {
      return {
        colors: {
          black: '#111111',
          navy: '#001f3f',
          red: '#FF4136',
          'cardinal red': '#C41E3A',
          'antique cherry red': '#a61f34',
          'royal': '#4169e1',
          'dark chocolate': '#340912',
          purple: '#5f2d9e'
        }
      }
    }
  }
</script>
