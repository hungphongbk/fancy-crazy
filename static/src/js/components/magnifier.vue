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
        .magnifier-preview(:id="PREVIEW_ID")
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
        internalId: 0,
        PREVIEW_ID: '',
        m: null,
        cw: 0,
        ch: 0
      }
    },
    watch: {
      largeSrc(value) {
        this.generateId();
        this.$nextTick(() => {
          this.attach();
        })
      }
    },
    methods: {
      generateId() {
        this.internalId++;
        this.id = `magnifier-thumb-${instances}-${this.internalId}`;
        this.PREVIEW_ID = `magnifier-preview-${instances}-${this.internalId}`;
      },
      init({target}) {
        const {clientHeight, clientWidth} = target;
        this.cw = clientWidth;
        this.ch = clientHeight;
      },
      attach() {
        const {m, id, largeSrc, PREVIEW_ID, zoom} = this;
        this.$nextTick(() => {
          m.attach({
            thumb: '#' + id,
            large: largeSrc,
            largeWrapper: PREVIEW_ID,
            zoom,
            onthumbenter: () => {
              const {cw, ch} = this;
              $(this.$el).find('.magnifier-lens').css({'background-size': `${cw}px ${ch}px`})
            }
          })
        })
      }
    },
    created() {
      instances++;
      this.generateId();
    },
    mounted() {
      this.m = Magnifier();
      this.attach();
    }
  }
</script>
