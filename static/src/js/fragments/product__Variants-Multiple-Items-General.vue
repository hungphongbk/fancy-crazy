<style lang="scss" module>
  @import "../../scss/inc";

  .label {
    line-height: 2.2;
    composes: label from 'sass-loader!./product__Variants-Multiple-Items__share.m-scss'
  }

  .btn {
    font-weight: 700;
    composes: item from 'sass-loader!./product__Variants-Multiple-Items__share.m-scss'
  }
</style>
<template lang="pug">
  .d-flex.flex-wrap
    span.mr-3(:class="$style.label") {{ type | uppercase }}:
    span.d-inline-block.mr-1.mb-1(v-for="(item,index) in fullItems" style="width: 75px")
      .btn.btn-sm.w-100.px-1.py-1.border-0(:class="[$style.btn, item.title===value.title?$bs.btnThemeRed:$bs.btnOutlineSecondary]", @click="$emit('input', item)")
        img.w-100(:src="item.image | shopifyImgUrl('small')")
</template>
<script>
  import mixins from './product__Variants-Multiple-Items-mixins';
  import intersect from 'lodash/intersection'
  import difference from 'lodash/difference'
  import pull from 'lodash/pull'
  import unique from 'lodash/uniq'

  export default {
    mixins: [mixins],
    props: {
      fullItems: {
        type: Array,
        default: () => []
      }
    },
    computed: {
      COMMON_START_TITLE() {
        const titles = this.fullItems.map(i => i.title);
        if (this.fullItems.length === 1) return titles;
        const splitted = titles.map(i => unique(i.split(' '))),
          commons = pull(splitted.reduce((acc, arr) => {
            if (acc === null) return arr;
            return intersect(acc, arr);
          }, null), '-');
        for (let i = 0; i < titles.length; i++) {
          titles[i] = difference(splitted[i], commons).join(' ');
        }

        return titles;
      }
    }
  };
</script>
