<style lang="scss" module>
  @import "../../scss/inc";

  .label {
    line-height: 2.2;
    composes: item from './product__Variants-Multiple-Items__share.m-scss'
  }

  .btn {
    font-weight: 700;
  }
</style>
<template lang="pug">
  .d-flex.flex-wrap
    span.mr-3(:class="$style.label") {{ type | uppercase }}:
    span(v-for="item in items")
      .btn.btn-sm.mr-1.mb-1(:class="[$style.btn, item.title===value.title?$bs.btnOutlineThemeRed:$bs.btnOutlineSecondary]", @click="$emit('input', item)") {{item.title | simplify(commonStartTitle) | uppercase }}
</template>
<script>
  import mixins from './product__Variants-Multiple-Items-mixins';

  function sharedStart(array) {
    let A = array.concat().sort(),
      a1 = A[0], a2 = A[A.length - 1], L = a1.length, i = 0;
    while (i < L && a1.charAt(i) === a2.charAt(i)) i++;
    return a1.substring(0, i);
  }

  export default {
    mixins: [mixins],
    computed: {
      commonStartTitle() {
        if (this.items.length === 1) return '';
        return sharedStart(this.items.map(i => i.title));
      }
    },
    filters: {
      simplify(value, common) {
        return value.replace(common, '');
      }
    }
  };
</script>
