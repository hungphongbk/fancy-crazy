<style lang="scss" module>
  .main {
    flex: 1;
    padding: 16px;
    overflow-x: hidden;
    overflow-y: hidden;
    position: relative;
    width: 100%;

    img {
      width: 100%;
      /*max-width: 650px;*/
      cursor: zoom-in;
    }
  }

  .zoomer {
    width: 1px;
    height: 1px;
    position: fixed;
    left: 0;
    top: 0;
    pointer-events: none;
    > canvas {
      position: absolute;
      left: -128px;
      top: -122px;
    }
  }
</style>
<template lang="pug">
  .d-flex.flex-column(@touchstart="onStart" @touchmove="onMove" @touchend="onEnd" @mousedown="onStart" @mousemove="onMove" @mouseup="onEnd")
    .d-flex.justify-content-around(:class="$style.main")
      div
        img(:src="src" ref="target" @load="initCanvas")
    div(:class="$style.zoomer" ref="zoomer")
      canvas(ref="canvas" :width="size*dPR" :height="size*dPR" :style="{width: `${size}px`, height: `${size}px`}")
</template>
<script>
  export default {
    props: {
      src: {
        type: String,
        required: true
      },
      radius:{
        type:Number,
        default:96
      }
    },
    data: () => ({
      element: null,
      target: null,
      ctx: null,
      size: 256,
      dPR: window.devicePixelRatio || 1,
      targetBCR: null,
      zoomed: 0,
      targetZoomed: 0,
      x: 0,
      y: 0,
      trackingTouch: false,
      scheduledUpdate: false
    }),
    methods: {
      initCanvas() {
        this.element = this.$refs.zoomer;
        this.target = this.$refs.target;

        this.ctx = this.$refs.canvas.getContext('2d');
        this.ctx.scale(this.dPR, this.dPR);

        this.targetBCR = this.target.getBoundingClientRect();

        requestAnimationFrame(this.update);
      },
      onStart(evt) {
        if (evt.target !== this.target)
          return;

        this.x = evt.pageX || evt.touches[0].pageX;
        this.y = evt.pageY || evt.touches[0].pageY;

        evt.preventDefault();
        this.trackingTouch = true;

        this.targetZoomed = 1;
        requestAnimationFrame(this.update);
      },
      onMove(evt) {
        if (!this.trackingTouch)
          return;

        this.x = evt.pageX || evt.touches[0].pageX;
        this.y = evt.pageY || evt.touches[0].pageY;
      },
      onEnd() {
        this.trackingTouch = false;
        this.targetZoomed = 0;
      },
      update() {
        const rad = 128,
          ctx = this.ctx,
          TAU = Math.PI * 2,
          MAX_RADIUS = this.radius,
          d = rad + MAX_RADIUS,
          radius = this.zoomed * MAX_RADIUS;

        const targetX = (this.x - this.targetBCR.left) / this.targetBCR.width;
        const targetY = (this.y - this.targetBCR.top) / this.targetBCR.height;
        const imageScale = 3;
        const scaledTargetWidth = this.targetBCR.width * imageScale;
        const scaledTargetHeight = this.targetBCR.height * imageScale;
        const glassyGlow = ctx.createRadialGradient(rad, rad, rad, rad, rad, 0);
        glassyGlow.addColorStop(0, 'rgba(255,255,255,0.8)');
        glassyGlow.addColorStop(0.5, 'rgba(255,255,255,0)');

        // Shadow.
        ctx.shadowColor = 'rgba(0,0,0,0.4)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetY = 8;

        // Background.
        ctx.clearRect(0, 0, this.size, this.size);
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(rad, d - radius, radius, 0, TAU);
        ctx.closePath();
        ctx.fill();

        // Zoomed image.
        ctx.save();
        ctx.beginPath();
        ctx.arc(rad, d - (radius + 1), radius * 1.03, 0, TAU);
        ctx.clip();
        ctx.closePath();
        ctx.drawImage(this.target,
          -targetX * scaledTargetWidth + rad, -targetY * scaledTargetHeight + rad,
          scaledTargetWidth,
          scaledTargetHeight);
        ctx.restore();

        // Glassy glow.
        ctx.fillStyle = glassyGlow;
        ctx.beginPath();
        ctx.arc(rad, d - radius, Math.max(0, radius - 2), 0, TAU);
        ctx.closePath();
        ctx.fill();

        // Position the parent element.
        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;

        // Update the zoom value.
        this.zoomed += (this.targetZoomed - this.zoomed) / 3;

        // Schedule another update if the zoom is fairly non-zero.
        if (this.zoomed > 0.001) {
          requestAnimationFrame(this.update);
        } else {
          this.zoomed = 0;
        }
      }
    }
  }
</script>
