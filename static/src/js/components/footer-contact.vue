<style lang="scss" module>
  .btn{
    font-family: Oswald,sans-serif;
    padding:{
      left: 1.4rem;
      right: 1.4rem;
    }
  }
</style>
<template lang="pug">
  div
    h6.font-weight-bold.d-inline-block Sign up to get the latest on promotions, new releases and more…
    .input-group.mt-2
      input.form-control.rounded-0(type="text", placeholder="Enter your email")
      .input-group-append
        button.btn.btn-success.rounded-0(type="button", :class="$style.btn") GO
</template>
<script>
export default {
name: ""
}
</script>
