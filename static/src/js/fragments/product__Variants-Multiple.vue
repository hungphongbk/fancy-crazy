<style lang="scss" module>
  @import "../../scss/inc";

  .product-variants {
    background-color: lighten(#6c757d, 45%);
    padding-bottom: 1px !important;
  }

  .item:not(:last-child) {
    margin-bottom: 1rem;
  }
</style>
<template lang="pug">
  div.py-4.px-3.mt-3(:class="$style.productVariants")
    div(v-for="(_,index) in variantOpts", :class="$style.item")
      variant-items(:type="options[index]", :items="OPT_LISTS[index]", v-model="variantOpts[index]", :full-items="OPT_FULL_LISTS[index]", @input="()=>LAST_INDEX_CHANGED=index")
</template>
<script>
  import unzip from 'lodash/unzip';
  import uniq from 'lodash/uniqBy';
  import VariantItems from './product__Variants-Multiple-Items';
  import {mapState} from 'vuex';
  import {assert} from "@/js/plugins/helpers";

  const $ = jQuery,
    mapVariant = variant => variant.title.split(/\s\/\s/).map(title => ({
      title,
      image: variant.image
    }));

  export default {
    components: {VariantItems},
    data() {
      //init separated lists (2) from options and variants
      const variantOpts = mapVariant(this.$store.state.pageProduct.selected);
      return {
        variantOpts,
        LAST_INDEX_CHANGED: -1
      };
    },
    computed: {
      ...mapState({
        list: state => state.pageProduct.product.variants,
        value: state => state.pageProduct.selected,
        options: state => state.pageProduct.product.options
      }),
      optLength() {
        return this.options.length;
      },
      OPT_FULL_LISTS() {
        return unzip(this.list.map(mapVariant))
          .map(item => uniq(item, i => i.title));
      },
      OPT_LISTS() {
        const {variantOpts} = this;
        return variantOpts.map((opt, index) => {
          const anotherOpts = variantOpts.filter(i => i !== opt);

          //split this.list into multiple lists depends on variant options
          //1. take item from this.list which "variant option tuple" available to current option
          //    compare by title (item title must contain option title)
          //2. refine, then unzip it and pick sublist that associated with current option
          //3. Don't forget to unique-ify result by title (prevent duplication)
          const subList = unzip(this.list
            .filter(({title}) =>
              anotherOpts.reduce(
                (rs, optVal) => rs && title.includes(optVal.title),
                true)
            )
            .map(mapVariant))[index];
          return uniq(subList, i => i.title);
        });
      },
      selected() {
        const {list, variantOpts} = this;
        return list.find(({title}) =>
            variantOpts.reduce(
              (rs, opt) => rs && title.includes(opt.title),
              true
            )
          //title.includes(opt1.title) && title.includes(opt2.title)
        );
      }
    },
    watch: {
      variantOpts: {
        handler(variantOpts) {
          const {list, LAST_INDEX_CHANGED} = this;
          let value = list.find(({title}) =>
            variantOpts.reduce(
              (rs, opt) => rs && title.includes(opt.title),
              true
            )
          );

          if (!assert(value)) {
            value = list.find(item =>
              mapVariant(item)[LAST_INDEX_CHANGED].title === variantOpts[LAST_INDEX_CHANGED].title);
            this.variantOpts = mapVariant(value);
            return;
          }
          // noinspection JSIgnoredPromiseFromCall
          this.$appStore.dispatch('pageProduct/select', {variantId: value.id});
        },
        deep: true
      }
    }
  };
</script>
