<style lang="scss" scoped>
  @import "../../scss/inc";

  .product-variants-label {
    line-height: 2.2;
  }

  .btn-outline-theme-red {
    font-weight: 700;
  }
</style>
<template lang="pug">
  .d-flex.flex-wrap
    span.product-variants-label.mr-3 {{ type | uppercase }}:
    span(v-for="item in items")
      .btn.btn-sm.mr-2.mb-2(:class="item.title===value.title?'btn-outline-theme-red':'btn-outline-secondary'", @click="$emit('input', item)") {{item.title | simplify(commonStartTitle) | uppercase }}
</template>
<script>
  import mixin from './product__Variants-Multiple-Items-mixins';

  function sharedStart(array) {
    let A = array.concat().sort(),
      a1 = A[0], a2 = A[A.length - 1], L = a1.length, i = 0;
    while (i < L && a1.charAt(i) === a2.charAt(i)) i++;
    return a1.substring(0, i);
  }

  export default {
    mixins: [mixin],
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
