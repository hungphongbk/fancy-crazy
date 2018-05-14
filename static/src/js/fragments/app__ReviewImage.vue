<style lang="scss" module>
  img.image {
    height: 300px;
    width: auto !important;
  }
</style>
<template lang="pug">
  slider(type="flickity", :opts="opts")
    img(v-for="{image_url} in items", :class="$style.image", :src="image_url | secure")
</template>
<script>
  import {Slider} from "@/js/components";

  export default {
    components: {Slider},
    props: {
      items: {
        type: Array,
        required: true
      }
    },
    data: () => ({
      opts: {
        infinite: true,
        variableWidth: true
      }
    })
  }
</script>
