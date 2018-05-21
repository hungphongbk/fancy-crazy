<template lang="pug" functional>
  div(:class="parent.$bs.row")
    div(:class="[parent.$bs.colSm2, parent.$bs.borderRight, parent.$bs.pl3]")
      slot(name="sidebar")
    div(:class="[parent.$bs.colSm10, parent.$bs.pr3]")
      div(:class="[parent.$bs.row, parent.$bs.noGutter]")
        slot(name="products")
      div(:class="[parent.$bs.row, parent.$bs.mt5]")
        slot(name="pagination")
</template>
<script>
  export default {}
</script>
