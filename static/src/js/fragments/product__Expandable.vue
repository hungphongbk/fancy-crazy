<style lang="scss" module>
  @import "../../scss/inc";

  .title {
    cursor: pointer;
    padding: {
      top: .6rem;
      bottom: .2rem;
    }
    h3 {
      font-family: Oswald, sans-serif;
      display: inline-block;
      @include media-breakpoint-down(sm) {
        font-size: $h4-font-size;
      }
    }
  }

  .icon {
    transition: all $animation-time*1.7 ease;
    margin-bottom: .3rem;
    &.open {
      transform: rotateX(180deg);
    }
  }
</style>
<template lang="pug">
  div(:class="$style.expandable")
    .text-center.border-top.border-bottom(:class="$style.title", @click="IS_TOGGLE = !IS_TOGGLE")
      .d-inline-flex.align-items-center
        h3.mr-2 PRODUCT DETAIL
        fa-icon(:icon="FA_CHEVRON_DOWN", :class="{ [$style.icon]:true, [$style.open]:IS_TOGGLE }")
    dropdown(:is-open="IS_TOGGLE")
      .pt-4(v-html="content")
</template>
<script>
  import FA_CHEVRON_DOWN from "@fortawesome/fontawesome-free-solid/faChevronDown";
  import Dropdown from '@/js/components/universal/dropdown'

  export default {
    components: {
      Dropdown
    },
    props: {
      content: {
        type: String,
        default: ''
      }
    },
    data: () => ({
      IS_TOGGLE: false,
      FA_CHEVRON_DOWN
    })
  }
</script>
