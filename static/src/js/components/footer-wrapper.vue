<template lang="pug" functional>
  //functional
  .container
    div(v-if="parent.$mq.phone")
      .row
        .col-10.offset-1
          slot(name="brand")
          .border-top.border-bottom
            .text-center.pt-3(@click="injections.vm.toggle = !injections.vm.toggle")
              h6.font-weight-bold.mb-3 INFORMATION
            component(:is="injections.comp.Dropdown", :is-open="injections.vm.toggle")
              slot(name="info", :toggle="injections.vm.toggle")
          .text-center
            h6.font-weight-bold.mt-3 GOOD FANCY CRAZY GUARANTEED
            div(v-html="injections.text")
            component.mt-2(:is="injections.comp.Contact")
            p.mt-4 <small>© 2018 Copyright FancyCrazy Inc. All Right Reserved.</small>
    div(v-else)
      .row
        .col-sm-3
          div
            slot(name="brand")
        .col-sm-9
          .row
            .col-sm-4
              h5.d-inline-block.mb-3.font-weight-bold INFORMATION
              slot(name="info")
            .col-sm-5
              h5.font-weight-bold GOOD FANCY CRAZY GUARANTEED
              div(v-html="injections.text")
            .col-sm-3
              component.mt-5(:is="injections.comp.Contact")
        .col-sm-12
          hr
          p.mt-2 © 2018 Copyright FancyCrazy Inc. All Right Reserved.
</template>
<script>
  import Dropdown from '@/js/components/universal/dropdown'
  import Contact from '@/js/components/footer-contact'
  //hack
  import Vue from 'vue'

  const vm = new Vue({
    data: {
      toggle: true
    }
  });

  export default {
    inject: {
      comp: {
        default: {
          Dropdown,
          Contact
        }
      },
      vm: {
        default: vm
      },
      text: {
        default: `<p><b><i>Melts in Your Heart, Not in Your Eyes</i></b></p>
<p>Join more than 70 thousand delighted customers sharing good Fancy in over 130 different countries!<br/>Not fully Fancy Crazy with your products?<br/>No worries! We've got it covered.</p>
<p><strong>+1 914-598-8976</strong><br/><strong>support@fancycrazy.com</strong></p>`
      }
    }
  }
</script>
