<style lang="scss" module>
  @import "../../scss/inc";

  $item-padding-x: .4rem;
  .breadcrumb {
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
        a(href="javascript:void(0)", @click="()=>goToTag()") {{collection.title | uppercase}}
      span /
      template(v-if="filteredTag")
        span(:class="$style.item")
          a(href="javascript:void(0)") {{filteredTag.title | uppercase}}
        span /
      span(:class="$style.item") Page {{current}} of {{totalPages}}
</template>
<script>
  import {mapGetters, mapActions} from 'vuex'
  import {spreadModuleProps} from "@/js/plugins/helpers"

  export default {
    computed: {
      ...mapGetters(spreadModuleProps('pageCollections', [
        'totalPages', 'current', 'filteredCollection', 'filteredTag'
      ])),
      collection() {
        if (!this.filteredCollection) return {
          title: 'all products',
          url: 'all'
        }
        return this.filteredCollection;
      }
    },
    methods: {
      ...mapActions(spreadModuleProps('pageCollections', ['goToTag']))
    }
  }
</script>
