<style lang="scss">
  @import "scss/inc";
  #app, #scroll {
    height: 100%;
  }
  #app #scroll{
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }
</style>
<template lang="pug">
  #app.d-flex.flex-column
    site-header
    #scroll.flex-grow-1(v-scroll="onScroll", ref="app")
      #primary.clearfix
        main#main(role="main")
          site-content
      site-footer
    transition(name="fade")
      loader(v-if="IS_LOADING")
</template>
<script>
  import SiteHeader from '@/js/components/menu-header'
  import SiteFooter from '@/js/components/footer'
  import Loader from '@/js/components/loader'
  import {GLOBAL_EVENTS} from "@/js/plugins";

  const THRESHOLD = 180;

  const $ = jQuery;
  export default {
    components: {
      SiteHeader,
      SiteFooter,
      Loader
    },
    data() {
      return {
        SCROLL_TOP: 0
      }
    },
    computed: {
      IS_LOADING() {
        return this.$store.state.isLoading;
      },
      /**
       * @return {float}
       */
      IS_SCROLLING() {
        return this.SCROLL_TOP > THRESHOLD ? 1 : (this.SCROLL_TOP*1.0) / THRESHOLD;
      }
    },
    watch: {
      IS_SCROLLING(value) {
        GLOBAL_EVENTS.$emit('scroll', value);
      }
    },
    methods: {
      onScroll(_, {scrollTop}) {
        this.SCROLL_TOP = scrollTop;
      }
    },
    async created() {
      this.$appStore.subscribe(mutation => {
        if (mutation.type === 'lockScroll') {
          const val = this.$appStore.state.lockScroll;
          $(this.$refs.app).css({'overflow-y': val ? 'hidden' : 'scroll'})
        }
      });
      await this.$store.dispatch('cart/fetch');
    }
  }
</script>
