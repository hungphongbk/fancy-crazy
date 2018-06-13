<style lang="scss">
</style>
<template lang="pug">
  v-app
    v-navigation-drawer(app clipped fixed)
      v-list(dense)
        v-list-tile(v-for="link in navLink", :key="link.name", :to="{name: link.name}")
          v-list-tile-title {{link.title}}
    v-toolbar(app color="blue-grey" dark fixed clipped-left)
      v-toolbar-title FancyCrazy Settings
    v-content
      v-container.page(fluid fill-height)
        router-view
</template>
<script>
  export default {
    data() {
      return {
        navLink: [
          {title: 'Reviews', name: 'reviews.index'}
        ]
      }
    }
  }
</script>
