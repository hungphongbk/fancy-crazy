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
    data: () => ({
      heightAnim: 0
    }),
    computed: {
      DROPDOWN_HEIGHT() {
        return this.isOpen ? 'auto' : 0;
      },
      /**
       * @returns {string}
       */
      DROPDOWN_HEIGHT_PX() {
        if (this.heightAnim === 'auto')
          return this.heightAnim;
        return this.heightAnim + 'px'
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

          const from = this.heightAnim,
            to = height === 0 ? this.$refs.dropdown.scrollHeight : 0,
            obj = {value: from};

          new TWEEN.Tween(obj)
            .to({value: to}, 320)
            // .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(() => {
              // console.log(obj.value);
              this.heightAnim = obj.value
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
