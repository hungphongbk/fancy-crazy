<style lang="scss" module>
  @import "../../scss/inc";
</style>
<template lang="pug">
  .container-fluid.pt-3(:class="$style.collections")
    div(ref="anchor")
    fragment-breadcrumb.mb-3
    .row
      .col-sm-2.border-right.pl-3
        template(v-if="filteredCollection || filteredTag")
          h5.mb-2 Filtered by
          ul.list-group
            a.list-group-item.list-group-item-action(v-if="filteredCollection")
              strong {{filteredCollection.title}}
              button.close(@click="goToCollection()") <span aria-hidden="true">&times;</span>
            a.list-group-item.list-group-item-action(v-if="filteredTag", href="javascript:void(0)")
              strong {{filteredTag.title}}
              button.close(@click="goToTag()") <span aria-hidden="true">&times;</span>
        h5.mt-4.mb-2 PRODUCTS
        .list-group
          a.list-group-item.list-group-item-action(v-for="col in sidebarCollections", @click="goToCollection(col.url)") {{col.title}}
        h5.mt-4.mb-2 INTERESTS
        .list-group
          a.list-group-item.list-group-item-action(v-for="col in sidebarTags", @click="goToTag(col.url)") {{col.title}}
      .col-sm-10.pr-3
        .row.no-gutter
          .col-sm-3.product-item(v-for="product in products")
            product-item(:product="product")
        .row.mt-5
          .col-sm-12(v-if="pages.length>1")
            nav.d-flex.justify-content-center
              ul.pagination(:class="$style.pagination")
                page-link(:is-disabled="!canPrev", @click="prevPage") Previous
                page-link(v-for="page in pages", :key="page.index", :is-current="page.label===current", @click="()=>goToPage({page:page.index})") {{page.label}}
                page-link(:is-disabled="!canNext", @click="nextPage") Next
    .row.mt-6
      .col-sm-12
        slider
          div(v-for="review in reviews.item")
            star-rating(:rating="review.point", :round-start-rating="false", :star-size="20", :show-rating="false", :read-only="true")
            h5.text-theme
              strong {{review.title}}
            .d-flex.align-items-start
              .w-25
                img.img-fluid(:src="review.product.images[0] | shopifyImgUrl('small')")
              .w-75
                i {{review.content}}
                br
                h6 {{review.name}}
</template>
<script>
  import collectionModule from '@/js/store/page-collections';
  import {mapActions, mapGetters} from 'vuex';
  import FragmentBreadcrumb from '@/js/fragments/collection__Breadcrumb';
  import {spreadModuleProps} from "@/js/plugins/helpers";
  import {ImagePair, Slider, ProductItem} from "@/js/components";
  import StarRating from 'vue-star-rating';

  export default {
    storeModule: ['pageCollections', collectionModule],
    components: {
      FragmentBreadcrumb,
      ImagePair,
      Slider,
      StarRating,
      ProductItem,
      PageLink: {
        functional: true,
        render: (h, {props: {isCurrent = false, isDisabled = false}, listeners, children}) => {
          const inner = (() => {
            if (isCurrent || isDisabled)
              return <span class="page-link">{children}</span>;
            else
              return <a class="page-link" href="javascript:void(0)">{children}</a>;
          })();
          return <li class={{'page-item': true, 'disabled': isDisabled, 'active': isCurrent}}
                     onClick={listeners.click}>{inner}</li>;
        }
      }
    },
    computed: {
      reviews() {
        return this.$store.state.pageCollections.reviews;
      },
      ...mapGetters(spreadModuleProps('pageCollections', [
        'products', 'current', 'pages', 'canNext', 'canPrev',
        'sidebarCollections', 'sidebarTags',
        'filteredCollection', 'filteredTag'
      ]))
    },
    methods: {
      ...mapActions(spreadModuleProps('pageCollections', [
        'goToPage', 'nextPage', 'prevPage', 'goToCollection', 'goToTag'
      ]))
    },
    created() {
      this.$store.commit('pageCollections/cache');
    },
    mounted() {
      this.$store.subscribe(mutation => {
        console.log(mutation.type);
        if (mutation.type === 'pageCollections/goToPage') {
          this.$refs['anchor'].scrollIntoView({behavior: 'smooth'});
        }
      });
    }
  };
</script>
