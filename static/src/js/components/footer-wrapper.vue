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
              slot(name="info")
          .text-center
            h6.font-weight-bold.mt-3 GOOD FANCY CRAZY GUARANTEED
            div(v-html="injections.text")
    div(v-else)
      .row
        .col-sm-4
          div
            slot(name="brand")
        .col-sm-8
          .row
            .col-sm-3
              h4 Information
              slot(name="info")
            .col-sm-5
              h4 Good Fancy Crazy Guaranteed
              div(v-html="injections.text")
            .col-sm-4
        .col-sm-12
          hr
          p.mt-2 © 2018 Copyright FancyCrazy Inc. All Right Reserved.
</template>
<script>
  import Dropdown from '@/js/components/universal/dropdown'
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
          Dropdown
        }
      },
      vm:{
        default: vm
      },
      text:{
        default:`<p><b><i>Melts in Your Heart, Not in Your Eyes</i></b></p>
<p>Join more than 70 thousand delighted customers sharing good Fancy in over 130 different countries!<br/>Not fully Fancy Crazy with your products?<br/>No worries! We've got it covered.</p>
<p><strong>+1 914-598-8976</strong><br/><strong>support@fancycrazy.com</strong></p>`
      }
    }
  }
</script>
