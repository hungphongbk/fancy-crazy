<style lang="scss" module>
  @import "../../scss/inc";

  .product-variants {
    background-color: lighten(#6c757d, 45%);
    padding-bottom: 1px !important;
  }
  .item:not(:last-child){
    margin-bottom: 1rem;
  }
</style>
<template lang="pug">
  div.py-4.px-3.mt-3(:class="$style.productVariants")
    div(v-for="(_,index) in opts", :class="$style.item")
      variant-items(:type="options[index]", :items="optLists[index]", v-model="opts[index]")
</template>
<script>
  import unzip from 'lodash/unzip';
  import uniq from 'lodash/uniqBy';
  import VariantItems from './product__Variants-Multiple-Items';
  import {mapState} from 'vuex';

  const $ = jQuery,
    mapVariant = variant => variant.title.split(/\s\/\s/).map(title => ({
      title,
      image: variant.image
    }));

  export default {
    components: {VariantItems},
    data() {
      //init separated lists (2) from options and variants
      const opts = mapVariant(this.$store.state.pageProduct.selected);
      return {
        opts
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
      optLists() {
        const {opts} = this;
        return opts.map((opt, index) => {
          const anotherOpts = opts.filter(i => i !== opt);

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
        const {list, opts} = this;
        return list.find(({title}) =>
            opts.reduce(
              (rs, opt) => rs && title.includes(opt.title),
              true
            )
          //title.includes(opt1.title) && title.includes(opt2.title)
        );
      }
    },
    watch: {
      opts: {
        handler(opts) {
          const {list} = this,
            value = list.find(({title}) =>
                opts.reduce(
                  (rs, opt) => rs && title.includes(opt.title),
                  true
                )
              //title.includes(opt1.title) && title.includes(opt2.title)
            );
          // noinspection JSIgnoredPromiseFromCall
          this.$appStore.dispatch('pageProduct/select', {variantId: value.id});
        },
        deep: true
      }
    }
  };
</script>
