<style lang="scss">
</style>
<template lang="pug">
  div
    fragment-collections
    .container
      fragment-featured-products(:index="0", :columns="3").mt-3
    .mt-5
      fragment-reviews(:items="reviews.group1")
    .container
      fragment-featured-products(:index="2", :columns="3").mt-4
    .mt-5
      fragment-reviews(:items="reviews.group2")
    .container
      fragment-featured-products(:index="3", :columns="3").mt-4
</template>
<script>
  import indexModule from '@/js/store/page-index'
  import FragmentCollections from '@/js/fragments/index__Collections'
  import FragmentFeaturedProducts from '@/js/fragments/index__FeaturedProducts'
  import FragmentReviews from '@/js/fragments/app__Review'
  import FragmentRecentlyProducts from '@/js/fragments/index__RecentlyProducts'

  export default {
    storeModule: ['pageIndex', indexModule],
    components: {
      FragmentCollections,
      FragmentFeaturedProducts,
      FragmentRecentlyProducts,
      FragmentReviews
    },
    computed:{
      reviews(){
        return this.$appStore.state.pageIndex.reviews
      }
    },
    async created() {
      await this.$store.dispatch('pageIndex/fetch');
    }
  }
</script>
