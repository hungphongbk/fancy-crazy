<style lang="scss" module>
  .imagePair {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .pair {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;

    img {
      width: 100%;
    }
  }
</style>
<template lang="pug">
  div(:class="$style.imagePair" @mouseover="over", @mouseleave="leave")
    transition(name="fade")
      .d-flex.align-items-end(:class="$style.pair", v-if="!MOUSE_OVER", :key="loadeds[0]")
        img.img-fluid(:src="loadeds[0]")
      .d-flex.align-items-end(:class="$style.pair", v-else, :key="loadeds[1]")
        img.img-fluid(:src="loadeds[1]")
</template>
<script>
  export default {
    props: {
      srcset: {
        type: Array,
        required: true
      }
    },
    data() {
      return {
        MOUSE_OVER: false
      }
    },
    asyncComputed: {
      loadeds: {
        get() {
          if (SSR === 'client') {
            const loadImg = src => new Promise(resolve => {
              const img = new Image();
              img.onload = () => resolve();
              img.src = src;
            });

            return new Promise(resolve => {
              Promise.all(this.srcset.map(loadImg))
                .then(() => {
                  resolve(this.srcset);
                })
            })
          } else return Promise.resolve(this.srcset);
        },
        default: ['', '']
      }
    },
    methods: {
      over() {
        this.MOUSE_OVER = true;
      },
      leave() {
        this.MOUSE_OVER = false;
      }
    }
  }
</script>
