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

  .filter {
    border-radius: 1.2rem !important;
    background-color: $gray-100;
    font-size: $font-size-base*0.85;
    @include lbn-box-shadow();
    transition: all $animation-time ease;
    &:hover {
      @include lbn-box-shadow(3px);
    }
    > button {
      font-size: 1.12rem;
      height: 1.2rem;
      display: inline-block;
      width: 1.2rem;
      border-radius: 50%;
      background-color: rgba(#000, 0);
      transition: all $animation-time*0.75 ease;
      margin-right: -0.6rem;
      > span {
        text-shadow: none;
      }
      &:hover {
        background-color: rgba(#000, .1);
      }
    }
  }
</style>
<template lang="pug">
  div(:class="$style.sidebar")
    template(v-if="FILTERED_COLLECTION || FILTERED_TAG")
      h5.mb-3 Filtered by
      ul.list-group
        a.list-group-item.list-group-item-action(v-if="FILTERED_COLLECTION", href="javascript:void(0)", :class="$style.filter")
          strong {{FILTERED_COLLECTION.title}}
          button.close(@click="GO_TO_COLLECTION()") <span aria-hidden="true">&times;</span>
        a.list-group-item.list-group-item-action(v-if="FILTERED_TAG", href="javascript:void(0)", :class="$style.filter")
          strong {{FILTERED_TAG.title}}
          button.close(@click="GO_TO_TAG()") <span aria-hidden="true">&times;</span>
    h5.mt-4.mb-4 PRODUCTS
    .list-group#products
      template(v-for="(col,index) in SIDEBAR_COLLECTIONS")
        template(v-if="col.children")
          a.list-group-item.list-group-item-action.d-flex.justify-content-between(href="javascript:void(0)", @click="toggleParent=(toggleParent!==index)?index:-1", :class="{ [$bs.listGroupItemPrimary]: toggleParent===index, [$style.active]: toggleParent===index }")
            span {{col.title}}
            fa-icon(:icon="FA_CHEVRON_UP", :rotation="toggle===index?null:180")
          dropdown(:is-open="toggleParent===index")
            div(:class="$style.children")
              sidebar-item(v-for="(childCol, subIndex) in col.children" :item="childCol" :index="subIndex+(index+1)*100" :key="subIndex+(index+1)*100") {{childCol.title}}
        sidebar-item(v-else :index="index" :item="col") {{col.title}}
    h5.mt-4.mb-4 INTERESTS
    .list-group
      //
      a.list-group-item.list-group-item-action(v-for="col in SIDEBAR_TAGS", href="javascript:void(0)" :class="{ [$bs.active]:(FILTERED_TAG && (col.title=== FILTERED_TAG.title)), [$style.active]: (FILTERED_TAG && (col.title=== FILTERED_TAG.title)) }", @click="GO_TO_TAG(col.url)") {{col.title}}
</template>
<script>
  import collectionMixin from '@/js/fragments/mixins/collection__Sidebar'
  import FA_CHEVRON_UP from '@fortawesome/fontawesome-free-solid/faChevronUp'
  import Dropdown from "@/js/components/universal/dropdown";

  export default {
    mixins: [collectionMixin],
    data: () => ({
      toggle: -1,
      toggleParent: -1,
      FA_CHEVRON_UP
    }),
    methods: {
      TOGGLE_MENU(index) {
        this.toggle = index;
      }
    }
  }
</script>
