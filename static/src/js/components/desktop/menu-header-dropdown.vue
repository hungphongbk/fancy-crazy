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
  .dropdown-menu.d-flex.justify-content-center.px-5.pb-4(:class="[$style.dropdown, `length-${children.length}`, children.length===5?$bs.pt1:$bs.pt4 ]")
    a.mx-1.d-flex.flex-column.align-items-center(:class="$style.dropdownItem", v-for="child in children", :href="child.url")
      //div(:class="children.length===5?$bs.mx6:$bs.mx4")
      .mx-5
        img.w-100(:src="child.image | shopifyImgUrl")
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
