<style lang="scss" module>
  img.image {
    height: 300px;
    width: auto !important;
  }
</style>
<template lang="pug">
  slider(type="flickity", :opts="opts")
    img(v-for="{image_url} in items", :class="$style.image", :src="image_url | secure", @load="imgLoad($event)")
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
    methods: {
      imgLoad({target}) {
        // const {clientWidth, clientHeight} = target,
        //   ratio = clientWidth * 1.0 / clientHeight;
        // // console.log(target.parentNode);
        // $(target.parentNode).width(300 * ratio);
        // $(target.parentNode.parentNode).width(300 * ratio);
      }
    }
  }
</script>
