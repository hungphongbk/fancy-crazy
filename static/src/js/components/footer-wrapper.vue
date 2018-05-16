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
            div(:class="parent.$bs.colSm3")
              h4 Information
              slot(name="info")
            div(:class="parent.$bs.colSm5")
              h4 Good Fancy Crazy Guaranteed
              p Melts in Your Heart, Not in Your Eyes
              p
                | Join more than 70 thousand delighted customers sharing good Fancy in over 130 different countries!
                br
                | Not fully Fancy Crazy with your products?
                br
                | No worries! We've got it covered.
              p
                strong +1 914-598-8976
                br
                strong support@fancycrazy.com
            div(:class="parent.$bs.colSm4")
        div(:class="parent.$bs.colSm12")
          hr
          p(:class="parent.$bs.mt2") © 2018 Copyright FancyCrazy Inc. All Right Reserved.
</template>
