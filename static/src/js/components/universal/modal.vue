<style lang="scss" module>
  @import "../../../scss/inc";

  .mobile {
    composes: mobile from global;
  }

  .modal {
    > div {
      background: white;
    }
    @include lbn-box-shadow;
    @include media-breakpoint-down(sm) {
      &.mobile {
        position: fixed;
        left: 0;
        right: 0;
        top: 62px;
        box-shadow: 0 5px 10px -3px rgba(0, 0, 0, 0.65);
        border-radius: 0 !important;
      }
    }
    &.backdrop::before {
      content: '';
      visibility: visible;
      background: rgba(0, 0, 0, .45);
      position: fixed;
      bottom: 0;
      top: 70px;
      left: 0;
      right: 0;
      z-index: -1;
    }
  }
</style>
<template lang="pug">
  transition(name="fade")
    template(v-if="show")
      //div(:class="$style.backdrop", v-if="backdrop")
      .rounded(:class="[$style.modal, $mq.phone?$style.mobile:'', backdrop?$style.backdrop:'']")
        .p-3
          slot
</template>
<script>
  export default {
    name: "Modal",
    props: {
      show: {
        type: Boolean,
        required: true
      },
      backdrop: {
        type: Boolean,
        default: false
      }
    }
  };
</script>
