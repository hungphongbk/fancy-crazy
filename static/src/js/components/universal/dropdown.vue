<template lang="pug">
  div(ref="dropdown", :style="DROPDOWN_CSS")
    slot
</template>
<script>
  import TWEEN from '@tweenjs/tween.js'

  export default {
    props: {
      isOpen: {
        type: Boolean,
        required: true
      },
      isParallax: {
        type: Boolean,
        default: false
      }
    },
    data() {
      const isOpen = this.isOpen;
      return {
        heightAnim: isOpen ? 'auto' : 0,
        CSS_TRANSFORMS: {
          opacity: isOpen ? 1 : 0,
          transform: 'translateY(0)'
        }
      }
    },
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
      },
      DROPDOWN_CSS() {
        const css = {
          overflow: 'hidden',
          height: this.heightAnim === 'auto' ? 'auto' : (this.heightAnim + 'px')
        };
        Object.assign(css, this.CSS_TRANSFORMS);
        return css;
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

          const from = height,
            to = height === 0 ? this.$refs.dropdown.scrollHeight : 0;

          const createObj = (isTo) => {
            const _height = [from, to],
              _opacity = [0, 1],
              _transform = [-1, 0];
            if (from > to)
              [_opacity, _transform].forEach(i => i.reverse())
            return {
              height: _height[isTo],
              opacity: _opacity[isTo],
              ...(this.isParallax ? {
                transform: _transform[isTo]
              } : {})
            }
          };

          const objFrom = createObj(0);
          // console.log(`${from} => ${to}`);

          new TWEEN.Tween(objFrom)
            .to(createObj(1), 320)
            .onUpdate(() => {
              this.heightAnim = objFrom.height;
              this.CSS_TRANSFORMS.opacity = objFrom.opacity;
              if (this.isParallax)
                this.CSS_TRANSFORMS.transform = `translateY(${objFrom.transform}rem`;
            })
            .onComplete(() => {
              this.heightAnim = (to === 0 ? 0 : 'auto');
              cancelAnimationFrame(frameHandler)
            })
            .start();
          animate();
        })
      }
    },
  }
</script>
