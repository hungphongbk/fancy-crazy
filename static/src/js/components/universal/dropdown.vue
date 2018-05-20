<template lang="pug">
  div(ref="dropdown", :style="{height: DROPDOWN_HEIGHT_PX}")
    slot
</template>
<script>
  import TWEEN from '@tweenjs/tween.js'

  export default {
    props: {
      isOpen: {
        type: Boolean,
        required: true
      }
    },
    data:() => ({
      DROPDOWN_HEIGHT_ANIMATE: 0
    }),
    computed: {
      DROPDOWN_HEIGHT() {
        return this.isOpen ? 'auto' : 0;
      },
      /**
       * @returns {string}
       */
      DROPDOWN_HEIGHT_PX() {
        if (this.DROPDOWN_HEIGHT_ANIMATE === 'auto')
          return this.DROPDOWN_HEIGHT_ANIMATE;
        return this.DROPDOWN_HEIGHT_ANIMATE + 'px'
      }
    },
    watch: {
      DROPDOWN_HEIGHT() {
        this.$nextTick(() => {
          // console.log(jQuery(this.$refs.dropdown).height());
          const height = jQuery(this.$refs.dropdown).height();
          let frameHandler;

          function animate() {
            if (TWEEN.update()) {
              frameHandler = requestAnimationFrame(animate)
            }
          }

          const from = this.DROPDOWN_HEIGHT_ANIMATE,
            to = height === 0 ? this.$refs.dropdown.scrollHeight : 0,
            obj = {value: from};

          new TWEEN.Tween(obj)
            .to({value: to}, 320)
            // .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
              // console.log(obj.value);
              this.DROPDOWN_HEIGHT_ANIMATE = obj.value
            })
            .onComplete(() => {
              cancelAnimationFrame(frameHandler)
            })
            .start();
          animate();
        })
      }
    },
  }
</script>
