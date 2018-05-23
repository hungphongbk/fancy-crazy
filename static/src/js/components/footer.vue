<style lang="scss" module>
  @import "../../scss/inc";

  .footer{
    p{
      color: $gray-700;
    }
  }

  .logo {
    width: 85%;
    margin-right: 15%;
    @include media-breakpoint-down(sm) {
      width: 60%;
      margin: {
        left: 20%;
        right: 20%;
      }
    }
  }

  .info {
    flex-basis: 50%;
    text-align: center;
    @include media-breakpoint-up(md){
      text-align: left;
    }
  }
</style>
<template lang="pug">
  .mt-sm-5(:class="$style.footer")
    wrapper
      div(slot="brand")
        img.img-fluid(:class="$style.logo", src="@/images/logo.png")
      div(slot="info")
        dl(:class="[$bs.dFlex, $bs.flexWrap, $bs.mt3]")
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
