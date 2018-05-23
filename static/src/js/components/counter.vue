<style lang="scss" module>
  .counter {
    flex-wrap: nowrap;
    width: unset;
    input.input{
      flex: 0 0 auto;
      width: 1.85rem;
    }
  }
</style>
<template lang="pug">
  .input-group(:class="$style.counter")
    .input-group-prepend
      span.input-group-text(@click="$emit('input', value-1)") -
    input.form-control(:class="$style.input", type="text", :value="value")
    .input-group-append
      span.input-group-text(@click="$emit('input', value+1)") +
</template>
<script>
  export default {
    name: "Counter",
    props: {
      value: {
        type: Number,
        required: true
      }
    }
  };
</script>
