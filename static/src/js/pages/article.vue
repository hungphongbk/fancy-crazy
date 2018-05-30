<style lang="scss" module>
  @import "../../scss/inc";
  .article{
    &-title{
      font-family: Oswald,sans-serif;
      font-weight: 700;
    }
    &-content{
      text-align: justify;

      >p>img{
        width: 100%;
        @include media-breakpoint-up(sm){
          width: 70%;
          margin: 1rem 15%;
        }
      }
    }
  }
</style>
<template lang="pug">
  .container.mt-2.mt-sm-3(:class="$style.article")
    h1.pb-3.mb-3.border-bottom(:class="$style.articleTitle") {{title}}
    p(:class="$style.articleContent", v-html="content")
</template>
<script>
  export default {
    data: () => __state__.pageArticle
  }
</script>
