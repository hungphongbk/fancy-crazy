<style lang="scss" module>
  @import "../../scss/inc";

  .item {
    composes: item from 'sass-loader!./product__Variants-Multiple-Items__share.m-scss';
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

  .label {
    composes: label from 'sass-loader!./product__Variants-Multiple-Items__share.m-scss';
    line-height: 2.3;
  }

  @include media-breakpoint-down(sm) {
    .label {
      line-height: 1.9;
    }
    .item {
      @include size(1.9rem);
      @include outline(1px, darken(white, 25%), 4px);
      margin-right: .9rem !important;
    }
  }
</style>
<template lang="pug">
  .d-flex
    p.mr-3(:class="$style.label") COLOR:
    dl.clearfix
      dd.rounded-circle.mr-4.float-left(v-for="item in items",
      :class="{ [$style.item]:true, [$style.selected]: item.title===value.title}",
      @click="$emit('input', item)",
      :style="{'background-color': colors[item.title.toLowerCase()]}",
      v-tooltip="item.title")
</template>
<script>
  import mixins from './product__Variants-Multiple-Items-mixins'

  export default {
    mixins: [mixins],
    data() {
      return {
        colors: {
          white: '#fff',
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
