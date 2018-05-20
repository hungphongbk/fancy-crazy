<style lang="scss" module>
  @import "../../../scss/inc";
  .modal{
    background: white;
    @include lbn-box-shadow;
    @include media-breakpoint-down(sm){
      position: fixed;
      left: 0;
      right: 0;
      top: 62px;
      box-shadow: 0 5px 10px -3px rgba(0, 0, 0, 0.65);
      border-radius: 0 !important;
    }
  }
</style>
<template lang="pug">
  transition(name="fade")
    .p-3.rounded(:class="$style.modal", v-if="show")
      slot
</template>
<script>
  export default {
    name: "Modal",
    props: {
      show: {
        type: Boolean,
        required: true
      }
    }
  };
</script>
