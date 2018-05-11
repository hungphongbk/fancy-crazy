<style lang="scss" scoped>
</style>
<template lang="pug" functional>
  footer
    .footer-mobile(v-if="parent.$mq.tablet")
    .footer-desktop.container(v-else)
      .row
        .col-sm-6
          .footer-brand
            slot(name="brand")
        .col-sm-3
          h4 Information
          slot(name="info")
        .col-sm-3
          h4 Vibe with us
          p
            strong 1-800-417-6562
            br
            strong Support@yeswevibe.com
        .col-sm-12
          hr
          p.mt-2 © 2018 Copyright YesWeVibe Inc. All Right Reserved.
</template>
