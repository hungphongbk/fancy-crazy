<style lang="scss" module>
  @import '../../scss/inc';

  .index-collections {
    a {
      @include reset-link{
        display: block;
      }
    }
  }

  .collection- {
    &item {
      .content img {
        width: 100%;
      }
      @include media-breakpoint-down(sm){
        width: 100% !important;
      }
    }
    &detail {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 0 15%;
      text-align: center;

      transition: all $animation-time ease;
      background: rgba(#000, 0);
      &:hover {
        background: rgba(#000, .65);
      }
    }
    &big {
      width: percentage(1/3);
    }
    &small {
      width: percentage(1/4);
    }
  }
  .title {
    color: white;
    position: relative;
    &:after {
      content: '';
      display: block;
      visibility: visible;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 1px;
      background: #fff;
      transform-origin: center center;
      transform: scaleX(0);
      transition: all $animation-time ease;
      .collection-item:hover & {
        transform: scaleX(1);
      }
    }

    @include media-breakpoint-down(sm){
      @include font-size-with-line-height($h6-font-size)
    }
  }
  .image{
    width: 100%;
  }
</style>
<template lang="pug">
  .d-flex.flex-wrap(:class="$style.indexCollections")
    div(v-for="(col,index) in INDEX_COLLECTIONS", :class="[ $style.collectionItem, index<3?$style.collectionBig:$style.collectionSmall]")
      a(:href="col.url")
        .ratio-1-1
          .content
            img.img-fluid(:class="$style.image", :src="col.image | shopifyImgUrl('grande')")
          .content(:class="$style.collectionDetail")
            div
              h4.pb-2(:class="$style.title") {{col.title}}
</template>
<script>
  import {mapState} from 'vuex';

  export default {
    computed: {
      ...mapState({
        INDEX_COLLECTIONS: state => state.pageIndex.collections
      })
    }
  };
</script>
