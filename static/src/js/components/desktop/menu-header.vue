<style lang="scss" module>
  @import "../../../scss/inc";

  @keyframes fadeIn {
    0% {
      opacity: 0;
      transform: translate(0, 20px);
    }
    100% {
      opacity: 1;
      transform: translate(0, 0);
    }
  }

  .nav {
    position: relative;
    .nav-link {
      font-weight: bold;
      font-size: 1.1rem;
      font-family: Oswald, sans-serif;
      @include font-size-with-line-height($font-size-base*1.3);

      position: relative;
      &:before {
        position: absolute;
        bottom: 4px;
        left: 0;
        right: 0;
        height: 1px;
        background: $gray-600;
        content: '';
        visibility: visible;

        transform: scaleX(0);
        opacity: 0;
        transition: all $animation-time ease;
      }
    }
    .nav-item:hover .nav-link:before {
      opacity: 1;
      transform: scaleX(1);
    }

    .dropdown-menu {
      display: block;
      opacity: 0;
      visibility: hidden;
    }
    .dropdown:hover > .dropdown-menu {
      visibility: visible;
      /*opacity: 1;*/
      animation: fadeIn .3s ease-in {
        fill-mode: forwards;
      }
    }

    .dropdown > .dropdown-toggle:active {
      /*Without this, clicking will make it sticky*/
      pointer-events: none;
    }
  }

  .nav-item.text-only {
    position: relative;
  }

  .searchGroup {
    /*position: absolute;*/
    /*right: 0;*/
    /*height: 100%;*/
  }

  .searchThumb {
    border-radius: 50%;
    background-color: $gray-200;
    z-index: 1;
    width: 2.2rem;
  }

  .searchPanel {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: $gray-200;

    input {
      -webkit-appearance: none;
      background-color: transparent;
      border: unset;
      font-size: 1.3rem;
      &:focus {
        outline: none;
      }
    }
  }

  .custom {
    position: unset;
  }
</style>
<template lang="pug">
  header.sticky-top
    nav.navbar.navbar-expand-sm.navbar-light.bg-white(:class="$style.nav", :style="NAVBAR_BOX_SHADOW")
      a.navbar-brand.ml-6(href="/")
        img.img-fluid(style="height: 70px;", src="@/images/logo.png")
      .navbar-collapse.collapse.d-flex.justify-content-center
        ul.navbar-nav
          li.nav-item(v-for="menuItem in menuList", :class="{[$bs.active]: menuItem.isActive, [$bs.dropdown]:menuItem.hasDropdown, [$style.dropdown]:menuItem.hasDropdown, [$style.custom]: true, [$style.navItem]: true, [$style.textOnly]: menuItem.isTextOnly}")
            nav-link(:item="menuItem") {{menuItem.title}}
            menu-header-dropdown(:class="$style.dropdownMenu", v-if="menuItem.hasDropdown", :children="menuItem.children", :is-text-only="menuItem.isTextOnly || false")
      .navbar-collapse.collapse.mr-5.justify-content-end(:class="$style.searchGroup")
        transition(name="fade")
          div(v-if="isSearchMode", :class="$style.searchPanel")
            .container.h-100.d-flex.align-items-center
              .py-2.border-bottom.w-75
                input.w-100(type="text", placeholder="type something here")
        a.ratio-1-1(:class="$style.searchThumb", @click="isSearchMode = !isSearchMode")
          .content.d-flex.justify-content-center.align-items-center
            fa-icon(:icon="SEARCH_TOGGLE_ICON", size="large")
        cart.ml-2(@mouseover.native="()=>CART_TOGGLE(true)", @mouseleave.native="()=>CART_TOGGLE(false)")
</template>
<script>
  import menuMixin from '@/js/components/menu-header-mixins';
  import SEARCH_ICON from '@fortawesome/fontawesome-free-solid/faSearch';
  import TIMES_ICON from '@fortawesome/fontawesome-free-solid/faTimes';
  import Cart from '../universal/cart';
  import MenuHeaderDropdown from './menu-header-dropdown'

  export default {
    mixins: [menuMixin],
    components: {
      Cart,
      NavLink: {
        functional: true,
        render(h, {props: {item}, data, children, parent}) {
          const $style = parent.$style,
            $bs = parent.$bs;
          return (<a class={[$style.navLink, $bs.navLink, $bs.py4]} {...item.aAttrs}>{children}</a>);
        }
      },
      MenuHeaderDropdown
    },
    data() {
      return {
        SEARCH_ICON,
        TIMES_ICON,
        isSearchMode: false
      };
    },
    computed: {
      SEARCH_TOGGLE_ICON() {
        const self = this;
        return self.isSearchMode ? self.TIMES_ICON : self.SEARCH_ICON;
      },
      IS_CART_POPUP() {
        return this.$store.state.cart.showPopup;
      }
    },
    methods: {
      CART_TOGGLE(value) {
        if (this.IS_CART_POPUP !== value)
          this.$store.commit('cart/togglePopup', value);
      }
    }
  };
</script>
