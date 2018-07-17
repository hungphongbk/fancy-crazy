<style lang="scss" module>
  @import "../../../scss/inc";

  %transition {
    transition: all $animation-time*2 ease;
  }

  .sidebar {
    > .dropdown-list {
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

  .filter {
    padding: .4rem 1rem;

    border-radius: 1.2rem !important;
    background-color: $gray-100;
    font-size: $font-size-base*0.78;
    @include lbn-box-shadow();
    transition: all $animation-time ease;
    &:hover {
      @include lbn-box-shadow(3px);
    }
    > button {
      font-size: 1rem;
      height: 1.1rem;
      display: inline-block;
      width: 1.1rem;
      border-radius: 50%;
      background-color: rgba(#000, 0);
      transition: all $animation-time*0.75 ease;
      margin-right: -0.55rem;
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
      .row.mb-4.mx-3.no-gutter
        .col-6.px-2(v-if="FILTERED_COLLECTION")
          div(:class="$style.filter")
            strong {{FILTERED_COLLECTION.title}}
            button.close(@click="GO_TO_COLLECTION()") <span aria-hidden="true">&times;</span>
        .col-6.px-2(v-if="FILTERED_TAG")
          div(:class="$style.filter")
            strong {{FILTERED_TAG.title}}
            button.close(@click="GO_TO_TAG()") <span aria-hidden="true">&times;</span>
    .d-flex.mx-3(:class="$style.dropdownList")
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
            a.list-group-item.list-group-item-action.d-flex.justify-content-between.align-items-center(href="javascript:void(0)", @click="toggleParent=index", :class="{ [$bs.listGroupItemPrimary]: toggleParent===index, [$style.active]: toggleParent===index }")
              span(:class="{ [$style.open]:toggle[index] }") {{col.title}}
              fa-icon(:icon="FA_CHEVRON_DOWN", :class="$style.icon")
            dropdown(:is-open="toggleParent===index")
              div(:class="$style.children")
                sidebar-item(v-for="(childCol, subIndex) in col.children" :item="childCol" :index="subIndex+(index+1)*100" :key="subIndex+(index+1)*100") {{childCol.title}}
          sidebar-item(v-else :index="index" :item="col") {{col.title}}
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
    data() {
      const bs = this.$bs;
      return {
        FA_CHEVRON_DOWN,
        IS_COLLECTION_TOGGLE: false,
        IS_TAG_TOGGLE: false,
        DROPDOWN_BUTTON: [bs.flexGrow1, bs.dFlex, bs.justifyContentCenter, bs.alignItemsCenter, this.$style.dropdownButton],
        toggle: -1,
        toggleParent: -1
      }
    },
    methods: {
      TOGGLE_MENU(index) {
        this.toggle=index;
      }
    },
    mounted() {
      this.$store.subscribe(mutation => {
        if (mutation.type === 'pageCollections/goToPage') {
          this.IS_COLLECTION_TOGGLE = false;
          this.IS_TAG_TOGGLE = false;
        }
      })
    }
  }
</script>
