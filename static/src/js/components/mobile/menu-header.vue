<style lang="scss" module>
  @import "../../../scss/inc";

  $s: $mobile-navbar-height;
  .part {
    flex-basis: percentage(1/3)
  }

  .logo {
    margin-top: -$navbar-padding-y/2 !important;
    padding: .3rem;
    img {
      height: calc(#{$mobile-navbar-height} - .6rem);
    }
  }

  .mobile-open {
    @include size($s);
    position: relative;
    > span {
      $h-mg: 0.5;
      display: block;
      float: left;
      clear: both;
      height: 3px;
      width: $s*$h-mg;
      border-radius: $s*$h-mg;
      background-color: lighten($body-color, 20%);
      position: absolute;
      left: $s*((1 - $h-mg)/2);
      overflow: hidden;
      transition: all $animation-time ease;
      &:nth-child(1) {
        margin-top: $s*(0.5-0.16);
        z-index: 9;
      }
      &:nth-child(2) {
        margin-top: $s*0.5;
      }
      &:nth-child(3) {
        margin-top: $s*(0.5+0.175);
      }
    }
    &.open > span {
      background-color: $theme-red;
      &:nth-child(2) {
        transform: scaleX(0);
      }
      &:nth-child(1) {
        transform: rotate(-45deg) translate(-7px, 6.4px);
      }
      &:nth-child(3) {
        transform: rotate(45deg) translate(-6.2px, -5.7px);
      }
    }
  }

  .menu {
    /*position: absolute;*/
    /*top: 100%;*/
    bottom: 0;
    /*right: 0;*/
    /*left: 0;*/
    overflow: scroll;
    > div {
      min-height: 100%;
    }
  }
</style>
<template lang="pug">
  header.sticky-top
    nav.navbar.navbar-expand-sm.navbar-light.bg-white.d-flex.justify-content-between(:class="$style.nav", :style="NAVBAR_BOX_SHADOW")
      div(:class="$style.part")
        .navbar-collapse
          div(:class="{ [$style.mobileOpen]:true, [$style.open]:IS_TOGGLE }", @click="IS_TOGGLE = !IS_TOGGLE")
            span.cls
            span
            span.cls
          modal(:class="$style.menu", :show="IS_TOGGLE")
            menu-header-dropdown(v-for="item in menuList", :key="item.handle", :item="item")
      .d-flex.justify-content-center(:class="$style.part")
        a.navbar-brand.p-0.m-0(href="/", :class="$style.logo")
          img.img-fluid(src="@/images/logo-soa.png")
      .d-flex.justify-content-end(:class="$style.part")
        search.mr-3
        cart
</template>
<script>
  import menuMixin from '@/js/components/menu-header-mixins';
  import Cart from '@/js/components/universal/cart'
  import Modal from '@/js/components/universal/modal';
  import MenuHeaderDropdown from '@/js/components/mobile/menu-header-dropdown'
  import Search from '@/js/components/universal/search'

  export default {
    mixins: [menuMixin],
    components: {
      Cart,
      Modal,
      MenuHeaderDropdown,
      Search
    },
    data: () => ({
      IS_TOGGLE: false,
    }),
    watch: {
      IS_TOGGLE(value) {
        this.$appStore.commit('lockScroll', value)
      }
    }
  }
</script>
