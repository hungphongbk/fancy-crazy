<style lang="scss" scoped>
  .magnifier-preview {
    width: 100%;
    height: 100%;
  }

  .magnifier- {
    &component {
      position: relative;
    }
    &preview-wrapper {
      position: absolute;
      left: 100%;
      top: 0;
      width: 100%;
      height: 100%;
    }
    &preview {
      /deep/ img.magnifier-large {
        transition: opacity .25s ease;
        opacity: 1;
        &.hidden {
          z-index: -1;
          display: block;
          opacity: 0;
        }
      }
    }
  }
</style>
<template lang="pug">
  .magnifier-component
    .ratio-4-5
      .content
        .magnifier-thumb-wrapper
          img(:id="id", :src="thumbSrc", style="width: 100%;", @load="init")
    .ratio-4-5.magnifier-preview-wrapper
      .content
        .magnifier-preview(:id="previewId")
</template>
<script>
  import {Magnifier} from "@/js/plugins";

  let instances = 0;

  export default {
    props: {
      thumbSrc: {
        type: String,
        required: true
      },
      largeSrc: {
        type: String,
        required: true
      },
      zoom: {
        type: Number,
        default: 2
      }
    },
    data() {
      return {
        id: '',
        previewId: '',
        m: null,
        cw: 0,
        ch: 0
      }
    },
    methods: {
      init({target}) {
        const {clientHeight, clientWidth} = target;
        this.cw = clientWidth;
        this.ch = clientHeight;
      }
    },
    created() {
      instances++;
      this.id = 'magnifier-thumb-' + instances;
      this.previewId = 'magnifier-preview-' + instances;
    },
    mounted() {
      this.m = Magnifier();
      const {m, id, largeSrc, previewId, zoom} = this;
      m.attach({
        thumb: '#' + id,
        large: largeSrc,
        largeWrapper: previewId,
        zoom,
        onthumbenter: () => {
          const {cw, ch} = this;
          $(this.$el).find('.magnifier-lens').css({'background-size': `${cw}px ${ch}px`})
        }
      })
    }
  }
</script>
