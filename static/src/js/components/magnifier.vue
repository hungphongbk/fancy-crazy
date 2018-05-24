<style lang="scss" module>
  .magnifier {
    position: relative;
    :global {
      .magnifier-preview {
        width: 100%;
        height: 100%;
      }

      .magnifier- {
        &preview-wrapper {
          position: absolute;
          left: 100%;
          top: 0;
          width: 100%;
          height: 100%;
        }
        &preview {
          img.magnifier-large {
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
    }
  }
</style>
<template lang="pug">
  div(:class="$style.magnifier")
    .ratio-6-7
      .content
        .magnifier-thumb-wrapper
          img(:id="id", :src="thumbSrc", style="width: 100%;", @load="init")
      transition(name="fade")
        .content(v-if="IS_LOADING")
          loader(:is-internal="true")
    .ratio-6-7.magnifier-preview-wrapper
      .content
        .magnifier-preview(:id="PREVIEW_ID")
</template>
<script>
  import Magnifier from "@/js/plugins/magnifier";
  import Loader from '@/js/components/loader'

  let instances = 0;

  export default {
    components: {Loader},
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
        ch: 0,
        IS_LOADING: false,
        WILL_SHOW_LOADING: false
      }
    },
    watch: {
      largeSrc(value) {
        const self = this;
        self.generateId();
        self.WILL_SHOW_LOADING = true;

        // After 100ms, if img loading process haven't done, show loader
        setTimeout(() => {
          if (self.WILL_SHOW_LOADING) {
            // console.log('show loading');
            self.IS_LOADING = true
          }
        }, 50);

        self.$nextTick(() => {
          self.attach();
        })
      }
    },
    methods: {
      generateId() {
        const self=this;
        self.internalId++;
        self.id = `magnifier-thumb-${instances}-${self.internalId}`;
        self.PREVIEW_ID = `magnifier-preview-${instances}-${self.internalId}`;
      },
      init({target}) {
        const {clientHeight, clientWidth} = target,
          self=this;
        self.cw = clientWidth;
        self.ch = clientHeight;
        self.WILL_SHOW_LOADING = false;
        self.IS_LOADING = false;
      },
      attach() {
        const self=this,
          {m, id, largeSrc, PREVIEW_ID, zoom} = self;
        self.$nextTick(() => {
          m.attach({
            thumb: '#' + id,
            large: largeSrc,
            largeWrapper: PREVIEW_ID,
            zoom,
            onthumbenter: () => {
              const {cw, ch} = self;
              $(self.$el).find('.magnifier-lens').css({'background-size': `${cw}px ${ch}px`})
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
