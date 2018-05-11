<style lang="scss" scoped>
  .logo {
    width: 60%;
    margin-right: 40%;
  }
</style>
<template lang="pug">
  .site-footer.mt-5
    wrapper
      div(slot="brand")
        img.img-fluid.logo(src="@/images/logo.png")
      div(slot="info")
        dl
          dd(v-for="{title,url} in infoList")
            a(:href="url") {{title}}
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
