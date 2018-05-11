<style lang="scss" module>
  @import "../../../scss/inc";
  .modal{
    background: white;
    @include lbn-box-shadow;
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
