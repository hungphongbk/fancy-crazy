<template lang="pug">
  #app
    site-header
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

  const $ = jQuery;
  export default {
    components: {
      SiteHeader,
      SiteFooter,
      Loader
    },
    computed: {
      IS_LOADING() {
        return this.$store.state.isLoading;
      }
    },
    async created() {
      this.$appStore.subscribe(mutation => {
        if (mutation.type === 'lockScroll') {
          const val = this.$appStore.state.lockScroll;
          $('body').css({overflow: val ? 'hidden' : 'scroll'})
        }
      })
      await this.$store.dispatch('cart/fetch');
    }
  }
</script>
