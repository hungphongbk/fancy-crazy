<template lang="pug">
  .row
    div(v-for="item in dataSource", :class="classes")
      slot(:item="item")
</template>
<script>
  export default {
    data() {
      return {
        classes: [
          this.$bs.col6,
          this.$bs.colSm4
        ]
      }
    }
  }
</script>
