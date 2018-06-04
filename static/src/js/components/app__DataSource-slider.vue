<style lang="scss" module>
  .chunk {
    width: 100%;
  }
</style>
<template lang="pug">
  slider(:class="$style.container", type="flickity", :opts="opts")
    div(:class="$style.chunk", v-for="chunk in SOURCE_CHUNKED")
      .row
        div(v-for="item in chunk", :class="classes")
          slot(:item="item")
</template>
<script>
  import {Slider} from "@/js/components/index";
  import chunk from 'lodash/chunk'

  export default {
    components: {Slider},
    data() {
      return {
        opts: {
          pageDots: 'top',
          prevNextButtons: (!this.$mq.phone)
        },
        classes: [
          this.$bs.col6,
          this.$bs.colSm3
        ]
      }
    },
    computed: {
      SOURCE_CHUNKED() {
        return chunk(this.dataSource, 4)
      }
    }
  }
</script>
