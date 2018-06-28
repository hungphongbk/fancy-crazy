<style lang="scss" module>
  @import "../../scss/inc";
  .blog {
    background: var(--light);
    padding-top: 1px;
    &-title {
      font-family: Oswald, sans-serif;
      font-weight: 700;
    }
  }
</style>
<template lang="pug">
  div(:class="$style.blog")
    .container.mt-2.mt-sm-3
      h1.pb-3.mb-3.border-bottom(:class="$style.blogTitle") {{title}}
      .row
        .col-12.col-sm-4(v-for="article in articles")
          .card.mb-3
            img.card-img-top(:src="article.image")
            .card-body
              h6.card-title
                a(:href="article.url") {{article.title}}
</template>
<script>
  export default {
    data(){
      return window.__state__.pageBlog;
    }
  }
</script>
