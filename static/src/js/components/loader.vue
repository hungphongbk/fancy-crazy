<style lang="scss" module>
  @import "../../scss/inc";

  $offset: 187;
  $duration: 1.4s;
  $size: 50px;
  $pad: 6px;

  .spinner {
    animation: rotator $duration linear infinite;
    width: $size;
    height: $size;
  }

  @keyframes rotator {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(270deg);
    }
  }

  .path {
    stroke-dasharray: $offset;
    stroke-dashoffset: 0;
    transform-origin: center;
    animation: dash $duration ease-in-out infinite,
    colors ($duration*4) ease-in-out infinite;
  }

  @keyframes colors {
    0% {
      stroke: #4285F4;
    }
    25% {
      stroke: #DE3E35;
    }
    50% {
      stroke: #F7C223;
    }
    75% {
      stroke: #1B9A59;
    }
    100% {
      stroke: #4285F4;
    }
  }

  @keyframes dash {
    0% {
      stroke-dashoffset: $offset;
    }
    50% {
      stroke-dashoffset: $offset/4;
      transform: rotate(135deg);
    }
    100% {
      stroke-dashoffset: $offset;
      transform: rotate(450deg);
    }
  }

  .loaderOverlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    &.internal {
      position: absolute;
      bottom: 0;
      right: 0;
      width: unset;
      height: unset;
    }
    background: rgba(#fff, .45);

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .wrapper {
    background: whitesmoke;
    border-radius: 50%;
    padding: $pad;
    width: $size + 2*$pad;
    height: $size + 2*$pad;
    @include lbn-box-shadow;
  }
</style>
<template functional lang="pug">
  div(:class="[$style.loaderOverlay, props.isInternal?$style.internal:null]")
    div(:class="$style.wrapper")
      svg(:class="$style.spinner", viewbox="0 0 50 50" xmlns="http://www.w3.org/2000/svg")
        circle(:class="$style.path", fill="none" stroke-width="4" stroke-linecap="round" cx="25" cy="25" r="23")
</template>
