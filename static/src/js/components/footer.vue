<style lang="scss" module>
  @import "../../scss/inc";

  .logo {
    width: 60%;
    margin-right: 40%;
    @include media-breakpoint-down(sm) {
      margin: {
        left: 20%;
        right: 20%;
      }
    }
  }

  .info {
    @include media-breakpoint-down(sm) {
      flex-basis: 50%;
      text-align: center;
    }
  }
</style>
<template lang="pug">
  .mt-sm-5
    wrapper
      div(slot="brand")
        img.img-fluid(:class="$style.logo", src="@/images/logo.png")
      div(slot="info")
        dl(:class="$mq.phone?[$bs.dFlex, $bs.flexWrap, $bs.mt3]:''")
          dd(:class="$style.info", v-for="{FOOTER_TITLE,FOOTER_URL} in infoList")
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
