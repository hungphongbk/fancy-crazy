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
    }
  }

  .anim- {
    &enter-active, &leave-active {
      transition: all $animation-time*2;
      max-height: 75vh;
      opacity: 1
    }
    &enter, &leave-to {
      opacity: 0;
      max-height: 0;
    }
  }
</style>
<template lang="pug">
  div(:class="$style.expandable")
    .text-center.border-top.border-bottom(:class="$style.title", @click="IS_TOGGLE = !IS_TOGGLE")
      .d-inline-block
        h3.mr-2 PRODUCT DETAIL
        fa-icon.pb-2(:icon="IS_TOGGLE?FA_CHEVRON_DOWN:FA_CHEVRON_UP", size="lg")
    transition(v-if="IS_TOGGLE", :enter-active-class="$style.animEnterActive", :leave-active-class="$style.animLeaveActive", :enter-class="$style.animEnter", :leave-to-class="$style.animLeaveTo")
      .pt-4(:class="$style.content", v-html="content")
</template>
<script>
  import FA_CHEVRON_DOWN from "@fortawesome/fontawesome-free-solid/faChevronDown";
  import FA_CHEVRON_UP from "@fortawesome/fontawesome-free-solid/faChevronUp";

  export default {
    props: {
      content: {
        type: String,
        default: ''
      }
    },
    data: () => ({
      IS_TOGGLE: false,
      FA_CHEVRON_DOWN,
      FA_CHEVRON_UP
    })
  }
</script>
