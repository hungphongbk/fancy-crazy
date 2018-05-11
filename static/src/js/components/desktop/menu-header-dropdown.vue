<style lang="scss" module>
  @import "../../../scss/inc";

  .dropdown {
    left: 0;
    right: 0;
    margin: 0;
    top: calc(100% - 0.7rem);
    border: unset;
    border-radius: unset;

    &-item {
      @include reset-link {
        display: block;
      }
      color: $gray-900;
      &:hover {
        color: $theme-red;
      }
      /*flex-grow: 1;*/
      :global(.length-3) & {
        flex-basis: 25%;
      }
      :global(.length-5) & {
        flex-basis: 17%;
      }
    }

    @at-root .title {
      font-family: Oswald, sans-serif;
    }
  }
</style>
<template lang="pug">
  .dropdown-menu.d-flex.justify-content-center.px-2.py-6(:class="[$style.dropdown, `length-${children.length}`]")
    a.mx-1.d-flex.flex-column.align-items-center(:class="$style.dropdownItem", v-for="child in children", :href="child.url")
      img.w-100.px-3(:src="child.image | shopifyImgUrl")
      h4.mt-4(:class="$style.title") {{child.title}}
</template>
<script>
  export default {
    props: {
      children: {
        type: Array,
        required: true
      }
    }
  }
</script>
