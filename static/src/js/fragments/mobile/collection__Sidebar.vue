<style lang="scss" module>
  @import "../../../scss/inc";

  %transition {
    transition: all $animation-time*2 ease;
  }

  .sidebar {
    > div:first-child {
      border: {
        top: 1px solid $gray-400;
        bottom: 1px solid $gray-400;
      }
    }
  }

  .title {
    font-size: $h6-font-size*0.9;
  }

  .dropdown-button {
    padding: .5rem;
  }

  .icon {
    @extend %transition;
    .open + & {
      transform: rotateX(180deg);
    }
  }

  .active {
    font-weight: 700;
  }

  .children {
    margin-left: 1rem;
    margin-bottom: .5rem;
  }

  .dropdown {
    overflow: hidden;
  }
</style>
<template lang="pug">
  div(:class="$style.sidebar")
    .d-flex.mx-3
      .border-right(:class="DROPDOWN_BUTTON", @click="()=> IS_COLLECTION_TOGGLE = !IS_COLLECTION_TOGGLE")
        h6.mx-2.my-0(:class="{ [$style.title]:true, [$style.open]:IS_COLLECTION_TOGGLE }") PRODUCTS
        fa-icon(:icon="FA_CHEVRON_DOWN", :class="{ [$style.icon]:true }")
      div(:class="DROPDOWN_BUTTON", @click="()=> IS_TAG_TOGGLE = !IS_TAG_TOGGLE")
        h6.mx-2.my-0(:class="{ [$style.title]:true, [$style.open]:IS_TAG_TOGGLE }") INTERESTS
        fa-icon(:icon="FA_CHEVRON_DOWN", :class="{ [$style.icon]:true }")
    dropdown(:is-open="IS_COLLECTION_TOGGLE", :class="$style.dropdown", :is-parallax="true")
      .list-group.mt-3.px-3
        template(v-for="(col,index) in SIDEBAR_COLLECTIONS")
          template(v-if="col.children")
            a.list-group-item.list-group-item-action.d-flex.justify-content-between.align-items-center(href="javascript:void(0)", @click="TOGGLE_MENU(index)", :class="{ [$bs.active]: toggle[index], [$style.active]: toggle[index] }")
              span(:class="{ [$style.open]:toggle[index] }") {{col.title}}
              fa-icon(:icon="FA_CHEVRON_DOWN", :class="$style.icon")
            dropdown(:is-open="toggle[index]")
              div(:class="$style.children")
                a.list-group-item.list-group-item-action(v-for="childCol in col.children", @click="GO_TO_COLLECTION(childCol.url)") {{childCol.title}}
          a.list-group-item.list-group-item-action(v-else, @click="GO_TO_COLLECTION(col.url)") {{col.title}}
    dropdown(:is-open="IS_TAG_TOGGLE", :class="$style.dropdown", :is-parallax="true")
      .list-group.mt-3.px-3
        a.list-group-item.list-group-item-action(v-for="col in SIDEBAR_TAGS", href="javascript:void(0)" :class="{ [$bs.active]:(FILTERED_TAG && (col.title=== FILTERED_TAG.title)), [$style.active]: (FILTERED_TAG && (col.title=== FILTERED_TAG.title)) }", @click="GO_TO_TAG(col.url)") {{col.title}}
</template>
<script>
  import collectionMixin from '@/js/fragments/mixins/collection__Sidebar'
  import Dropdown from '@/js/components/universal/dropdown'
  import FA_CHEVRON_DOWN from "@fortawesome/fontawesome-free-solid/faChevronDown";

  export default {
    mixins: [collectionMixin],
    components: {
      Dropdown
    },
    data() {
      const bs = this.$bs;
      return {
        FA_CHEVRON_DOWN,
        IS_COLLECTION_TOGGLE: false,
        IS_TAG_TOGGLE: false,
        DROPDOWN_BUTTON: [bs.flexGrow1, bs.dFlex, bs.justifyContentCenter, bs.alignItemsCenter, this.$style.dropdownButton],
        toggle: Array(50).fill(false),
      }
    },
    methods: {
      TOGGLE_MENU(index) {
        this.$set(this.toggle, index, !this.toggle[index])
      }
    }
  }
</script>
