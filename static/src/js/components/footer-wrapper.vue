<style lang="scss" scoped>
</style>
<template lang="pug" functional>
  footer
    .footer-mobile(v-if="parent.$mq.tablet")
    .footer-desktop(v-else, :class="parent.$bs.container")
      div(:class="parent.$bs.row")
        div(:class="parent.$bs.colSm4")
          .footer-brand
            slot(name="brand")
        div(:class="parent.$bs.colSm8")
          div(:class="parent.$bs.row")
            div(:class="parent.$bs.colSm4")
              h4 Information
              slot(name="info")
            div(:class="parent.$bs.colSm4")
              h4 Vibe with us
              p
                strong +1 914-598-8976
                br
                strong support@fancycrazy.com
            div(:class="parent.$bs.colSm4")
        div(:class="parent.$bs.colSm12")
          hr
          p(:class="parent.$bs.mt2") © 2018 Copyright FancyCrazy Inc. All Right Reserved.
</template>
