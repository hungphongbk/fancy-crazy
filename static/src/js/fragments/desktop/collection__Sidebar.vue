<style lang="scss" module>
  @import "../../../scss/inc";

  .sidebar {
    font-size: .9em;
  }

  .active {
    font-weight: 700;
  }

  .children {
    margin-left: 1rem;
    margin-bottom: .5rem;
  }
</style>
<template lang="pug">
  div(:class="$style.sidebar")
    template(v-if="FILTERED_COLLECTION || FILTERED_TAG")
      h5.mb-3 Filtered by
      ul.list-group
        a.list-group-item.list-group-item-action(v-if="FILTERED_COLLECTION")
          strong {{FILTERED_COLLECTION.title}}
          button.close(@click="GO_TO_COLLECTION()") <span aria-hidden="true">&times;</span>
        a.list-group-item.list-group-item-action(v-if="FILTERED_TAG", href="javascript:void(0)")
          strong {{FILTERED_TAG.title}}
          button.close(@click="GO_TO_TAG()") <span aria-hidden="true">&times;</span>
    h5.mt-4.mb-4 PRODUCTS
    .list-group#products
      template(v-for="(col,index) in SIDEBAR_COLLECTIONS")
        template(v-if="col.children")
          a.list-group-item.list-group-item-action.d-flex.justify-content-between(href="javascript:void(0)", @click="TOGGLE_MENU(index)", :class="{ [$bs.active]: toggle[index], [$style.active]: toggle[index] }")
            span {{col.title}}
            fa-icon(:icon="FA_CHEVRON_UP", :rotation="toggle[index]?null:180")
          transition(v-if="toggle[index]", name="fade")
            div(:class="$style.children")
              a.list-group-item.list-group-item-action(v-for="childCol in col.children", @click="GO_TO_COLLECTION(childCol.url)") {{childCol.title}}
        a.list-group-item.list-group-item-action(v-else, @click="GO_TO_COLLECTION(col.url)") {{col.title}}
    h5.mt-4.mb-4 INTERESTS
    .list-group
      //
      a.list-group-item.list-group-item-action(v-for="col in SIDEBAR_TAGS", href="javascript:void(0)" :class="{ [$bs.active]:(FILTERED_TAG && (col.title=== FILTERED_TAG.title)), [$style.active]: (FILTERED_TAG && (col.title=== FILTERED_TAG.title)) }", @click="GO_TO_TAG(col.url)") {{col.title}}
</template>
<script>
  import collectionMixin from '@/js/fragments/mixins/collection__Sidebar'
  import FA_CHEVRON_UP from '@fortawesome/fontawesome-free-solid/faChevronUp'

  export default {
    mixins: [collectionMixin],
    data: () => ({
      toggle: Array(50).fill(false),
      FA_CHEVRON_UP
    }),
    methods:{
      TOGGLE_MENU(index) {
        this.$set(this.toggle, index, !this.toggle[index])
      }
    }
  }
</script>
