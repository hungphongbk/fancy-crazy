<style lang="scss">
  @import "scss/inc";

  #app, #scroll {
    height: 100%;
  }

  #app #scroll {
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
  }

  #primary, #main {
    padding-top: 1px;
  }
</style>
<style lang="scss" module>
  // fix safari bug
  .hide-menu {
    .site-header {
      transform: translateY(-100%);
      height: 0;
      overflow: hidden;
    }
  }
</style>
<template lang="pug">
  #app.d-flex.flex-column
    site-header(:class="$style.siteHeader")
    #scroll.flex-grow-1(v-scroll="onScroll", ref="app", :class="$style.siteBody")
      #primary.clearfix
        main#main(role="main")
          component(:is="SITE_CONTENT")
      site-footer
    transition(name="fade")
      div(v-if="IS_LOADING")
        loader(:is-long="LONG_TASK")
</template>
<script>
  import SiteHeader from '@/js/components/menu-header'
  import SiteFooter from '@/js/components/footer'
  import Loader from '@/js/components/loader'
  import {GLOBAL_EVENTS} from "@/js/plugins";
  import SITE_CONTENT from '@/js/pages'

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
        SCROLL_TOP: 0,
        SITE_CONTENT,
        LONG_TASK: false
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
        return this.SCROLL_TOP > THRESHOLD ? 1 : (this.SCROLL_TOP * 1.0) / THRESHOLD;
      }
    },
    watch: {
      IS_LOADING(val) {
        if (!val) {
          this.LONG_TASK = false;
        } else {
          setTimeout(() => {
            if (this.IS_LOADING)
              this.LONG_TASK = true;
          }, 2000)
        }
      },
      IS_SCROLLING(value) {
        GLOBAL_EVENTS.$emit('scroll', value);
      }
    },
    methods: {
      onScroll(_, {scrollTop}) {
        this.SCROLL_TOP = scrollTop;
      },
      ON_VUE_GALLERY_TOGGLE(value) {
        console.log(this.$style);
        const hideMenu = this.$style.hideMenu;
        if (value)
          this.$el.classList.add(hideMenu);
        else
          this.$el.classList.remove(hideMenu);
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
      GLOBAL_EVENTS.$on('vue-gallery-toggle', value => this.ON_VUE_GALLERY_TOGGLE(value))
    }
  }
</script>
