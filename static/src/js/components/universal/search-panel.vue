<style lang="scss" module>
  @import "../../../scss/inc";

  .panel {
    display: block;
    input {
      display: block;
      width: 100%;
      padding: .375rem .75rem;
      font-size: 1.1rem;
      line-height: 1.5;
      color: #495057;
      border: none;
      background-color: transparent;
      position: relative;

      + span {
        position: absolute;
        bottom: 0;
        left: 1rem;
        right: 5rem;
        height: 1px;
        background-color: $gray-600;
        transform-origin: 30% center;
        transform: scaleX(0);
        opacity: 0;
        transition: all $animation-time ease;
      }

      &:focus {
        outline: none;
        + span {
          transform: scaleX(1);
          opacity: .9;
        }
      }
    }
  }

  .box {
    height: $mobile-navbar-full-height;
  }
</style>
<template lang="pug">
  div(:class="$style.panel")
    .mt-1.d-flex.align-items-center(:class="$style.box")
      .p-2.w-100(style="position: relative")
        input(placeholder="SEARCH...")
        span
</template>
<script>
  export default {}
</script>
