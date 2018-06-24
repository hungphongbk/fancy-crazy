<style lang="scss" module>
  @import "../../../scss/inc";

  .dropdown {
    left: 0;
    right: 0;
    margin: 0;
    top: calc(100% - 0.7rem);
    border: unset;
    border-radius: unset;
    @include lbn-box-shadow(5px);
    &.text-only {
      box-shadow: unset;
      min-width: 300px;
      left: unset;

      .dropdown-item {
        text-transform: uppercase;
      }
    }

    &-item {
      @include reset-link {
        display: block;
      }
      color: $gray-900;
      &:hover {
        color: $theme-red;
      }
      flex-basis: unset;
      :global(.length-3) & {
        flex-basis: percentage(1/3);
      }
      :global(.length-5) & {
        flex-basis: percentage(1/5);
      }
    }

    @at-root .title {
      font-family: Oswald, sans-serif;
    }
  }
</style>
<template lang="pug">
  .dropdown-menu.d-flex.justify-content-center.pb-4(:class="DROPDOWN_CLASSES")
    a.mx-1.d-flex.flex-column.align-items-center(:class="$style.dropdownItem", v-for="child in children", :href="child.url")
      //div(:class="children.length===5?$bs.mx6:$bs.mx4")
      .mx-5(v-if="child.image")
        img.w-100(:src="child.image | shopifyImgUrl")
      h4(:class="[$style.title, isTextOnly?$bs.mt3:$bs.mt4]") {{child.title}}
</template>
<script>
  export default {
    props: {
      children: {
        type: Array,
        required: true
      },
      isTextOnly: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      DROPDOWN_CLASSES() {
        const cls = [this.$style.dropdown];
        if (!this.isTextOnly) {
          cls.push(...[
            this.$bs.px5,
            `length-${this.children.length}`,
            this.children.length === 5 ? this.$bs.pt1 : this.$bs.pt4
          ])
        } else {
          cls.push([
            this.$bs.px2,
            this.$style.textOnly,
            this.$bs.flexColumn
          ])
        }
        return cls;
      }
    }
  }
</script>
