<style lang="scss" module>
  @import "../../../scss/inc";

  %will-change {
    will-change: transform;
  }

  %keyframe-props {
    animation-timing-function: linear;
    animation-fill-mode: forwards;
  }

  @mixin apply-keyframe($keyframe) {
    .expanded & {
      animation-name: expand#{$keyframe};
      animation-duration: .7s;
      @extend %keyframe-props;
    }
    .collapsed & {
      animation-name: collapse#{$keyframe};
      animation-duration: .3s;
      @extend %keyframe-props;
    }
  }

  .search {
    display: flex;
    position: relative;

    &-thumb {
      width: 2.2rem;
      z-index: 999;
      will-change: transform;
      transition: transform .2s ease-in-out;
      &, .collapsed & {
        transform: scale(1.05) translate(.5rem, 0.2rem);
      }
      .expanded & {
        transform: scale(0.95) translate(3.2rem, 0.2rem);
      }

      &:after {
        $s: -.5rem;
        border-radius: 50%;
        will-change: box-shadow;
        visibility: visible;
        content: '';
        position: absolute;
        top: $s;
        left: $s;
        bottom: $s;
        right: $s;
        background-color: white;
        transition: box-shadow .2s ease-in-out;
        z-index: -1;

        &, .collapsed & {
          box-shadow: none;
        }
        .expanded & {
          @include lbn-box-shadow();
        }
      }
    }

    &-box-outer {
      @extend %will-change;
      position: fixed;
      top: 0;
      left: 0;
      .expanded & {
        z-index: 998;
      }
    }

    &-box-inner {
      position: absolute;
      background-color: $gray-200;
      border-radius: 50%;
      z-index: -1;
      opacity: 0;
      @extend %will-change;
      @include apply-keyframe(Anim);
    }

    &-box-inverter {
      @extend %will-change;
      @include apply-keyframe(ContentAnim)
    }

    &-box {
      position: fixed;
      height: 100vh;
      width: 100vw;
      opacity: 0;
      will-change: transform;
      transform: translateY(20px);
      transition: transform 0.3s cubic-bezier(0, 0, 0.31, 1),
      opacity 0.3s cubic-bezier(0, 0, 0.31, 1);

      .expanded & {
        transform: translateY(0px);
        opacity: 1;
        pointer-events: auto;
      }
    }
  }

  @include media-breakpoint-up(sm) {
    .search {
      display: inline-flex;
    }
  }
</style>
<template lang="pug">
  div(:class="$style.search")
    a.ratio-1-1.d-inline-block(:class="$style.searchThumb", ref="btn", @click="()=>SEARCH_BOX_TOGGLE = !SEARCH_BOX_TOGGLE")
      .content.d-flex.justify-content-center.align-items-center
        transition(name="fade")
          fa-icon(v-if="!SEARCH_BOX_TOGGLE", :icon="SEARCH_ICON", size="lg")
          fa-icon(v-else, :icon="CLOSE_ICON", size="lg")
    div(:class="$style.searchBoxOuter", ref="el", style="transform: translateX(-100%)")
      div(:class="$style.searchBoxInner", ref="elInner")
        div(:class="$style.searchBoxInverter", ref="elInverter")
          div(:class="$style.searchBox", ref="content")
            search-panel
</template>
<script>
  // @flow
  import SEARCH_ICON from "@fortawesome/fontawesome-free-solid/faSearch";
  import CLOSE_ICON from "@fortawesome/fontawesome-free-solid/faTimes";
  import SearchPanel from './search-panel'

  export default {
    components: {SearchPanel},
    data: () => ({
      SEARCH_ICON,
      CLOSE_ICON,
      ANIM_SCALE: 0,
      EASE_STYLE_TAG: null,
      SEARCH_BOX_TOGGLE: false
    }),
    watch: {
      SEARCH_BOX_TOGGLE(expanded) {
        const el = this.$el,
          inner = this.$refs.elInner,
          outer = this.$refs.el;
        el.classList.remove(this.$style.expanded);
        el.classList.remove(this.$style.collapsed);

        window.getComputedStyle(inner).transform;

        if (expanded) {
          inner.style['z-index'] = 'auto';
          outer.style.transform = 'translateX(0)';
          el.classList.add(this.$style.expanded);
        } else {
          el.classList.add(this.$style.collapsed);
          window.setTimeout(() => {
            inner.style['z-index'] = -1;
            outer.style.transform = 'translateX(-100%)';
          }, 300)
        }

      }
    },
    methods: {
      ANIM_CALCULATE() {
        const {el, elInner, elInverter, content, btn}: { [key: string]: HTMLDivElement } = this.$refs;

        const [elBCR, collapsed, expanded] = [el, btn, content].map((e: HTMLDivElement) => e.getBoundingClientRect());

        const expandedWidth = Math.abs(expanded.right - elBCR.left),
          expandedHeight = Math.abs(expanded.bottom - elBCR.top),
          collapsedWidth = collapsed.width,
          collapsedHeight = collapsed.height;

        const exRadius = Math.sqrt(expandedWidth * expandedWidth +
          expandedHeight * expandedHeight);
        const colRadius = collapsedWidth * 0.5;

        this.ANIM_SCALE = (exRadius - colRadius) / colRadius;

        // set initial sizes
        el.style.width = `${expandedWidth}px`;
        el.style.height = `${expandedHeight}px`;

        // put inner initial position the same of button
        elInner.style.width = `${collapsedWidth}px`;
        elInner.style.height = `${collapsedHeight}px`;
        elInner.style.left = `${collapsed.left}px`;
        elInner.style.top = `${collapsed.top}px`;
        content.style.left = `-${collapsed.left}px`;
        content.style.top = `-${collapsed.top}px`;

        elInner.style.transformOrigin = `${collapsedWidth * 0.5}px ${collapsedHeight * 0.5}px`;
        elInverter.style.transformOrigin = `${collapsedWidth * 0.5}px ${collapsedHeight * 0.5}px`;
      },
      /**
       * @return {null}
       */
      ANIM_CREATE_EASE() {
        if (!this.EASE_STYLE_TAG) {
          this.EASE_STYLE_TAG = document.createElement('style');
          this.EASE_STYLE_TAG.classList.add(this.$style.search);
        }
        const ease = this.EASE_STYLE_TAG;

        const expandAnimation = [];
        const expandContentsAnimation = [];
        const collapseAnimation = [];
        const collapseContentsAnimation = [];

        for (let i = 0; i <= 100; i++) {
          const step = this.EASE_CALC(i / 100);

          // Expand animation.
          this.KEYFRAME_APPEND({
            i,
            step,
            start: 1,
            end: this.ANIM_SCALE,
            outerAnimation: expandAnimation,
            innerAnimation: expandContentsAnimation
          });

          // Collapse animation.
          this.KEYFRAME_APPEND({
            i,
            step,
            start: this.ANIM_SCALE,
            end: 1,
            outerAnimation: collapseAnimation,
            innerAnimation: collapseContentsAnimation
          });
        }

        ease.textContent = [
          `@keyframes ${this.$style.expandAnim}{${expandAnimation.join('')}}`,
          `@keyframes ${this.$style.expandContentAnim}{${expandContentsAnimation.join('')}}`,
          `@keyframes ${this.$style.collapseAnim}{${collapseAnimation.join('')}}`,
          `@keyframes ${this.$style.collapseContentAnim}{${collapseContentsAnimation.join('')}}`].join('');

        document.head.appendChild(ease);
        console.log(ease);
        return ease;
      },
      KEYFRAME_APPEND({
                        i,
                        step,
                        start,
                        end,
                        outerAnimation,
                        innerAnimation
                      } = opts) {
        const isExpand = start < end,
          opacity = isExpand ? step : (1 - step);

        const scale = start + (end - start) * step;
        const invScale = 1 / scale;

        outerAnimation.push(`${i}%{opacity:${opacity};transform:scale(${scale});}`);

        innerAnimation.push(`${i}%{transform: scale(${invScale});}`);
      },
      /**
       * @return {number}
       */
      CLAMP_CALC(value, min, max) {
        return Math.max(min, Math.min(max, value));
      },
      /**
       * @return {number}
       */
      EASE_CALC(v, pow = 4) {
        v = this.CLAMP_CALC(v, 0, 1);

        return 1 - Math.pow(1 - v, pow);
      }
    },
    mounted() {
      this.ANIM_CALCULATE();
      this.ANIM_CREATE_EASE();
    }
  }
</script>
