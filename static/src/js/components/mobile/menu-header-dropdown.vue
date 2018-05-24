<style lang="scss" module>
  @import "../../../scss/inc";

  %transition {
    transition: all $animation-time*2 ease;
  }

  .subtitle {
    @include reset-link {
      color: $body-color;
    }
    font-family: Oswald, sans-serif;
    padding: {
      top: .9rem;
      bottom: .9rem;
    }
  }

  .title {
    font-weight: bold;
    composes: subtitle;

    @extend %transition;
    &.open {
      color: $theme-red;
    }
  }

  .icon {
    @extend %transition;
    .open + & {
      transform: rotateX(180deg);
    }
  }

  .dropdown-panel {
    overflow: hidden;
  }
</style>
<template lang="pug">
  .px-3
    .d-flex.justify-content-between.align-items-center(@click="OPEN_DROPDOWN")
      h5.m-0(:class="{ [$style.title]:true, [$style.open]:IS_TOGGLE }") {{item.title}}
      fa-icon(:icon="FA_CHEVRON_DOWN", v-if="item.hasDropdown", :class="{ [$style.icon]:true }")
    //div(:class="$style.dropdownPanel", v-if="item.hasDropdown", :style="{height: DROPDOWN_HEIGHT_PX}", ref="dropdown")
    dropdown(:class="[$style.dropdownPanel]", v-if="item.hasDropdown", :is-open="IS_TOGGLE")
      .pt-3
        a.text-center.d-block(v-for="child in item.children", :href="child.url", :class="item.children.length===5?$bs.px6:$bs.px2")
          img.w-100(:src="child.image | shopifyImgUrl")
          h5(:class="$style.subtitle") {{child.title|uppercase}}
</template>
<script>
  import FA_CHEVRON_DOWN from "@fortawesome/fontawesome-free-solid/faChevronDown";
  import Dropdown from '@/js/components/universal/dropdown'

  export default {
    components:{
      Dropdown
    },
    props: {
      item: {
        type: Object,
        required: true
      }
    },
    data: () => ({
      FA_CHEVRON_DOWN,
      IS_TOGGLE: false,
    }),
    methods: {
      OPEN_DROPDOWN() {
        if (this.item.hasDropdown) {
          this.IS_TOGGLE = !this.IS_TOGGLE
        }
      }
    }
  }
</script>
