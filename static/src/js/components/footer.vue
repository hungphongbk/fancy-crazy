<style lang="scss" module>
  .logo {
    width: 60%;
    margin-right: 40%;
  }
</style>
<template lang="pug">
  .site-footer.mt-5
    wrapper
      div(slot="brand")
        img.img-fluid(:class="$style.logo", src="@/images/logo.png")
      div(slot="info")
        dl
          dd(v-for="{FOOTER_TITLE,FOOTER_URL} in infoList")
            a(:href="FOOTER_URL") {{FOOTER_TITLE}}
</template>
<script>
  import Wrapper from './footer-wrapper'
  import infoList from '@/json/footer-info.json'

  export default {
    components: {
      Wrapper
    },
    data: () => ({
      infoList
    })
  }
</script>
