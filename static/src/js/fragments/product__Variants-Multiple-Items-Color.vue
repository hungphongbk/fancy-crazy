<style lang="scss" module>
  @import "../../scss/inc";

  .item {
    composes: item from 'sass-loader!./product__Variants-Multiple-Items__share.m-scss';
    @include size(2.1rem);
    display: inline-block;
    margin-right: 1.2rem;

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
    line-height: 2.1;
  }

  @include media-breakpoint-down(sm) {
    .label {
      line-height: 1.9;
    }
    .item {
      @include size(1.9rem);
      @include outline(1px, darken(white, 25%), 4px);
      margin-right: .9rem;
    }
  }
</style>
<template lang="pug">
  .d-flex
    p.mr-3(:class="$style.label") COLOR:
    dl.clearfix
      dd.rounded-circle.float-left(v-for="item in items",
      :class="{ [$style.item]:true, [$style.selected]: item.title===value.title}",
      @click="$emit('input', item)",
      :style="{'background': GET_COLOR(item.title) }",
      v-tooltip="item.title")
</template>
<script>
  import mixins from './product__Variants-Multiple-Items-mixins'
  import rainbow from '../../images/rainbow-spirituality-circle.svg'

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
          purple: '#5f2d9e',
          blue: '#3490DC',
          pink: '#F66D9B',
          grey: '#B8C2CC',
          brown: '#613B1F',
          yellow: '#F2D024',
          green: '#38C172',
          'light blue': '#809dc9',
          'cherry red': '#a61226'
        }
      }
    },
    methods: {
      /**
       * @return {string}
       */
      GET_COLOR(title) {
        const _title = title.toLowerCase();
        if (this.colors[_title]) return this.colors[_title];
        return `center/cover no-repeat url(${rainbow})`
      }
    }
  }
</script>
