<style lang="scss" module>
  @import "../../../scss/inc";

  .panel {
    display: block;
    height: 100%;
    max-height: 100%;
    input {
      display: block;
      width: 100%;
      padding: .375rem .75rem;
      font-size: 1.1rem;
      line-height: 1.5;
      color: #495057;
      border: none;
      background-color: transparent;
      position: relative;

      + span {
        position: absolute;
        bottom: 0;
        left: 1rem;
        right: 5rem;
        height: 1px;
        background-color: $gray-600;
        transform-origin: 30% center;
        transform: scaleX(0);
        opacity: 0;
        transition: all $animation-time ease;
      }

      &:focus {
        outline: none;
        + span {
          transform: scaleX(1);
          opacity: .9;
        }
      }
    }
    :global(.component__loader) {
      background-color: transparent !important;
      height: calc(100% - #{$mobile-navbar-height});
    }
  }

  .box {
    height: $mobile-navbar-full-height;
  }

  .item {
    &-list {
      flex-grow: 1;
      overflow: scroll;
      will-change: transform;
      transform: translateZ(0);
    }

    &-title {
      color: darken($theme-red, 5%);
      @include font-size-with-line-height($h6-font-size*0.9)
    }
  }
</style>
<template lang="pug">
  .d-flex.flex-column(:class="$style.panel")
    .mt-1.d-flex.align-items-center(:class="$style.box")
      .p-2.w-100(style="position: relative")
        input(placeholder="SEARCH...", v-model="searchKeyword", ref="input")
        span
    .p-3(:class="$style.itemList")
      ul.list-unstyled
        li(v-for="product in searched")
          a.media.mb-2(:href="product.url")
            img.mr-2.w-20(:src="product.image | shopifyImgUrl('compact')")
            .media-body
              h6.mt-0.mb-1(:class="$style.itemTitle") {{product.title}}
              star-rating(:rating="5", :star-size="13", :show-rating="false", :read-only="true")
      transition(name="fade", :is-internal="true")
        loader(v-if="IS_LOADING")
</template>
<script>
  import debounce from "lodash/debounce";
  import StarRating from 'vue-star-rating';
  import Loader from '@/js/components/loader'

  const ensureJSON = obj => {
    try {
      return JSON.parse(obj)
    } catch (e) {
      return obj;
    }
  };

  export default {
    components: {StarRating, Loader},
    props: {
      isExpanded: {
        type: Boolean,
        required: true
      }
    },
    data: () => ({
      searchKeyword: '',
      SEARCH_KW: '',
      IS_LOADING: false,
    }),
    asyncComputed: {
      searched: {
        get() {
          return new Promise(resolve => {
            this.IS_LOADING = true;
            jQuery.get('https://fancycrazy.com/search/?type=product&view=json&q=' + this.SEARCH_KW)
              .then(obj => {
                this.IS_LOADING = false;
                resolve(ensureJSON(obj).results)
              })
          })
        },
        default: []
      }
    },
    watch: {
      searchKeyword: debounce(function (value) {
        this.SEARCH_KW = value;
      }, 200),
      isExpanded(value) {
        setTimeout(() => {
          if (value)
            this.$refs.input.focus();
          else {
            this.searchKeyword = this.SEARCH_KW = '';
          }
        }, 200);
      }
    }
  }
</script>
