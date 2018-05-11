<template lang="pug">
  #app
    site-header
    #primary.clearfix
      main#main(role="main")
        site-content
    site-footer
    transition(name="fade")
      loader(v-if="isLoading")
</template>
<script>
  import SiteHeader from '@/js/components/menu-header'
  import SiteFooter from '@/js/components/footer'
  import Loader from '@/js/components/loader'

  export default {
    components: {
      SiteHeader,
      SiteFooter,
      Loader
    },
    computed: {
      isLoading() {
        return this.$store.state.isLoading;
      }
    },
    async created() {
      await this.$store.dispatch('cart/fetch');
    }
  }
</script>
