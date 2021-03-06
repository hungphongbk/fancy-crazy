<style lang="scss">
  @import "../../scss/inc";

  #app #scroll {
    @include media-breakpoint-down(sm) {
      will-change: transform;
      transform: translateZ(0);
    }
  }
</style>
<style lang="scss" module>
  @import "../../scss/inc";
  .show-best-selling{
    img{
      width: percentage(1/3);
      @include media-breakpoint-up(sm){
        width: percentage(1/6);
      }
    }
  }
</style>
<template lang="pug">
  .container-fluid.pt-3
    div(ref="anchor")
    fragment-breadcrumb(v-if="!$mq.phone").mb-3
    collection-layout
      template(slot="sidebar")
        collection-sidebar
      template(slot="products")
        .col-12.text-center(v-if="IS_BEST_SELLING")
          div(:class="$style.showBestSelling")
            img(src="@/images/empty-box.svg")
            p.mt-0.mb-4.text-muted <i>This collection is empty. Instead, below is our best sellings!</i>
        .col-6.col-sm-3(v-for="product in products")
          product-item(:product="product")
      template(slot="pagination")
        .col-sm-12(v-if="pages.length>1")
          nav.d-flex.justify-content-center
            ul.pagination
              page-link(:is-disabled="!canPrev", @click="prevPage") Previous
              page-link(v-for="page in pages", :key="page.index", :is-current="page.label===current", @click="()=>goToPage({page:page.index})") {{page.label}}
              page-link(:is-disabled="!canNext", @click="nextPage") Next
    .row.mt-6
      .col-sm-12
        fragment-reviews(:items="group1")
        fragment-reviews(:items="group2")
    .mt-5
    fragment-recently-products
</template>
<script>
  import collectionModule from '@/js/store/page-collections';
  import {mapActions, mapGetters} from 'vuex';
  import FragmentBreadcrumb from '@/js/fragments/collection__Breadcrumb';
  import {spreadModuleProps} from "@/js/plugins/helpers";
  import {ImagePair, Slider, ProductItem} from "@/js/components";
  import StarRating from 'vue-star-rating';
  import FragmentReviews from '@/js/fragments/app__Review'
  import CollectionSidebar from '@/js/fragments/collection__Sidebar'
  import CollectionLayout from '@/js/fragments/collection__Layout'
  import FragmentRecentlyProducts from '@/js/fragments/index__RecentlyProducts'

  export default {
    storeModule: ['pageCollections', collectionModule],
    components: {
      FragmentBreadcrumb,
      ImagePair,
      Slider,
      StarRating,
      ProductItem,
      FragmentReviews,
      CollectionSidebar,
      CollectionLayout,
      FragmentRecentlyProducts,
      PageLink: {
        functional: true,
        render: (h, {props: {isCurrent = false, isDisabled = false}, listeners, children, parent}) => {
          const $bs = parent.$bs,
            inner = (() => {
              if (isCurrent || isDisabled)
                return <span class={$bs.pageLink}>{children}</span>;
              else
                return <a class={$bs.pageLink} href="javascript:void(0)">{children}</a>;
            })();
          return <li class={{[$bs.pageItem]: true, [$bs.disabled]: isDisabled, [$bs.active]: isCurrent}}
                     onClick={listeners.click}>{inner}</li>;
        }
      },
    },
    computed: {
      /**
       * @return {boolean}
       */
      IS_BEST_SELLING(){
        return this.$store.state.pageCollections.isBestSelling;
      },
      ...mapGetters(spreadModuleProps('pageCollections', [
        'products', 'current', 'pages', 'canNext', 'canPrev',
        'sidebarCollections', 'sidebarTags',
        'filteredCollection', 'filteredTag',
        'group1', 'group2'
      ]))
    },
    methods: {
      ...mapActions(spreadModuleProps('pageCollections', [
        'goToPage', 'nextPage', 'prevPage', 'goToCollection', 'goToTag'
      ])),
    },
    created() {
      this.$store.commit('pageCollections/cache');
    },
    async mounted() {
      this.$store.subscribe(mutation => {
        if (mutation.type === 'pageCollections/goToPage') {
          this.$refs['anchor'].scrollIntoView({behavior: 'smooth'});
        }
      });
      console.log(this.$appStore);
      await this.$appStore.dispatch('pageCollections/fetch');
    }
  };
</script>
