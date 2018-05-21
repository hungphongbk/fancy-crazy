<template lang="pug" functional>
  div(:class="parent.$bs.row")
    div(:class="parent.$bs.col12")
      slot(name="sidebar")
    slot(name="products")
    slot(name="pagination")
</template>
<script>
  export default {}
</script>
