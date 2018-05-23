<style lang="scss" module>
  @import "../../scss/inc";

  img.image {
    height: 200px;
    width: auto !important;
    @include media-breakpoint-up(sm) {
      height: 300px;
    }
  }
</style>
<template lang="pug">
  slider(type="flickity", :opts="opts")
    img(v-for="{image_url} in items", :class="$style.image", :src="image_url | secure | storage($mq.phone)")
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
    }),
    filters: {
      storage(url, isPhone) {
        if (!/storage.googleapis.com/.test(url)) return url;
        return url.replace('w.jpg', (isPhone ? '-200w' : '-500w') + '.jpg');
      }
    }
  }
</script>
