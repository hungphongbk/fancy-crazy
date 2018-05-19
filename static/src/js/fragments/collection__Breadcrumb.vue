<style lang="scss" module>
  @import "../../scss/inc";

  $item-padding-x: .4rem;
  .breadcrumb {
    @include font-size-with-line-height($font-size-base*0.9);
    margin-left: -$item-padding-x;
    a {
      &, &:hover {
        color: $theme-red;
      }
    }
  }

  .item {
    margin-right: $item-padding-x;
    margin-left: $item-padding-x;
  }
</style>
<template lang="pug">
  div(:class="$style.breadcrumb")
    p
      span(:class="$style.item")
        a(href="#") HOME
      span /
      span(:class="$style.item")
        a(href="javascript:void(0)", @click="() => GO_TO_TAG()") {{BR_COLLECTION.title | uppercase}}
      span /
      template(v-if="BR_FILTERED_TAG")
        span(:class="$style.item")
          a(href="javascript:void(0)") {{BR_FILTERED_TAG.title | uppercase}}
        span /
      span(:class="$style.item") Page {{BR_CURRENT}} of {{BR_TOTAL_PAGES}}
</template>
<script>
  import {createNamespacedHelpers} from 'vuex'
  import {spreadModuleProps} from "@/js/plugins/helpers"

  const {mapGetters, mapActions} = createNamespacedHelpers('pageCollections');

  export default {
    computed: {
      ...mapGetters({
        BR_TOTAL_PAGES: 'totalPages',
        BR_CURRENT: 'current',
        BR_FILTERED_COLLECTION: 'filteredCollection',
        BR_FILTERED_TAG: 'filteredTag'
      }),
      /**
       * @return {object}
       */
      BR_COLLECTION() {
        if (!this.BR_FILTERED_COLLECTION) return {
          title: 'all products',
          url: 'all'
        };
        return this.BR_FILTERED_COLLECTION;
      }
    },
    methods: {
      ...mapActions({
        GO_TO_TAG: 'goToTag'
      })
    }
  }
</script>
