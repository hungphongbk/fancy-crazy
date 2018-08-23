<style lang="scss" module>
  $spacing: 1.3rem;
  .vertical, .inner {
    height: 100%;
    max-height: 100%;

    position: relative;
  }
  .inner{
    overflow-y: scroll;
  }

  .up, .down {
    position: absolute;
    left: $spacing/2;
    right: $spacing/2;
    height: $spacing;
  }

  .up {
    top: -$spacing*1.3;
  }

  .down {
    bottom: -$spacing*1.3;
  }
</style>
<template lang="pug">
  div(:class="$style.vertical")
    .d-flex.justify-content-center.align-items-start(:class="$style.up" @click="$emit('prev')")
      fa-icon(:icon="FA_CHEVRON_UP" size="lg")
    .d-flex.justify-content-center.align-items-end(:class="$style.down" @click="$emit('next')")
      fa-icon(:icon="FA_CHEVRON_DOWN" size="lg")
    div(:class="$style.inner" ref="inner")
      slot
</template>
<script>
  import FA_CHEVRON_UP from '@fortawesome/fontawesome-free-solid/faChevronUp'
  import FA_CHEVRON_DOWN from '@fortawesome/fontawesome-free-solid/faChevronDown'

  export default {
    data: () => ({
      FA_CHEVRON_UP,
      FA_CHEVRON_DOWN
    })
  }
</script>
