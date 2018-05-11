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
    :global .nav-link {
      font-family: "OpenSansCondensed", sans-serif;
      font-weight: bold;
      font-size: 1.1rem;
    }
    :global {
      .dropdown-menu {
        display: block;
        opacity: 0;
        visibility: hidden;
      }
      .dropdown:hover > .dropdown-menu {
        visibility: visible;
        :local {
          animation: fadeIn .3s ease-in {
            fill-mode: forwards;
          }
        }
      }

      .dropdown > .dropdown-toggle:active {
        /*Without this, clicking will make it sticky*/
        pointer-events: none;
      }
      .nav-link {
        font-family: Oswald,sans-serif;
        @include font-size-with-line-height($font-size-base*1.3)
      }
    }
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
      border-width: unset;
      border-style: unset;
      font-size: 1.3rem;
      &:focus {
        outline: none;
      }
    }
  }

  .custom:global(.nav-item){
    position: unset;
  }
</style>
<template lang="pug">
  header.sticky-top
    nav.navbar.navbar-expand-sm.navbar-light.bg-white(:class="$style.nav")
      a.navbar-brand.ml-6(href="/")
        img.img-fluid(style="height: 70px;", src="@/images/logo-soa.png")
      .navbar-collapse.collapse.d-flex.justify-content-center
        ul.navbar-nav
          li.nav-item(v-for="menuItem in menuList", :class="{'active': menuItem.isActive, 'dropdown':menuItem.hasDropdown, [$style.custom]: true}")
            nav-link(:item="menuItem") {{menuItem.title}}
            menu-header-dropdown(v-if="menuItem.hasDropdown", :children="menuItem.children")
      .navbar-collapse.collapse.mr-5.justify-content-end(:class="$style.searchGroup")
        transition(name="fade")
          div(v-if="isSearchMode", :class="$style.searchPanel")
            .container.h-100.d-flex.align-items-center
              .py-2.border-bottom.w-75
                input.w-100(type="text", placeholder="type something here")
        a.ratio-1-1(:class="$style.searchThumb", @click="isSearchMode = !isSearchMode")
          .content.d-flex.justify-content-center.align-items-center
            fa-icon(:icon="SearchToggleIcon", size="large")
        cart
</template>
<script>
  import menuMixin from '@/js/components/menu-header-mixins';
  import SearchIcon from '@fortawesome/fontawesome-free-solid/faSearch';
  import TimesIcon from '@fortawesome/fontawesome-free-solid/faTimes';
  import Cart from './cart';
  import MenuHeaderDropdown from './menu-header-dropdown'

  export default {
    mixins: [menuMixin],
    components: {
      Cart,
      NavLink: {
        functional: true,
        render(h, {props: {item}, data, children, parent}) {
          return (<a class={['nav-link py-4']} {...item.aAttrs}>{children}</a>);
        }
      },
      MenuHeaderDropdown
    },
    data() {
      return {
        SearchIcon,
        TimesIcon,
        isSearchMode: false
      };
    },
    computed: {
      SearchToggleIcon() {
        const self = this;
        return self.isSearchMode ? self.TimesIcon : self.SearchIcon;
      }
    }
  };
</script>
