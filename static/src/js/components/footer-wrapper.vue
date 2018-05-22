<template lang="pug" functional>
  footer
    div(v-if="parent.$mq.phone")
      div(:class="parent.$bs.row")
        div(:class="[parent.$bs.col10, parent.$bs.offset1]")
          slot(name="brand")
          div(:class="[parent.$bs.borderTop, parent.$bs.borderBottom]")
            div(:class="[parent.$bs.textCenter, parent.$bs.pt2]", @click="injections.vm.toggle = !injections.vm.toggle")
              h5(:class="parent.$bs.fontWeightBold") INFORMATION
            component(:is="injections.comp.Dropdown", :is-open="injections.vm.toggle")
              slot(name="info")
    div(v-else, :class="parent.$bs.container")
      div(:class="parent.$bs.row")
        div(:class="parent.$bs.colSm4")
          div
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
<script>
  import Dropdown from '@/js/components/universal/dropdown'
  //hack
  import Vue from 'vue'

  const vm = new Vue({
    data: {
      toggle: false
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
      }
    }
  }
</script>
