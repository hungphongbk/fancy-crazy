<style lang="scss" module>
  @import "../../scss/inc";

  .sidebar {
    font-size: .9em;
  }
  .active{
    font-weight: 700;
  }
  .children{
    margin-left: 1rem;
    margin-bottom: .5rem;
  }
</style>
<template lang="pug">
  .container-fluid.pt-3(:class="$style.collections")
    div(ref="anchor")
    fragment-breadcrumb.mb-3
    .row
      .col-sm-2.border-right.pl-3(:class="$style.sidebar")
        template(v-if="filteredCollection || filteredTag")
          h5.mb-3 Filtered by
          ul.list-group
            a.list-group-item.list-group-item-action(v-if="filteredCollection")
              strong {{filteredCollection.title}}
              button.close(@click="goToCollection()") <span aria-hidden="true">&times;</span>
            a.list-group-item.list-group-item-action(v-if="filteredTag", href="javascript:void(0)")
              strong {{filteredTag.title}}
              button.close(@click="goToTag()") <span aria-hidden="true">&times;</span>
        h5.mt-4.mb-4 PRODUCTS
        .list-group#products
          template(v-for="(col,index) in sidebarCollections")
            template(v-if="col.children")
              a.list-group-item.list-group-item-action.d-flex.justify-content-between(href="javascript:void(0)", @click="toggleMenu(index)", :class="{ [$bs.active]: toggle[index], [$style.active]: toggle[index] }")
                span {{col.title}}
                fa-icon(:icon="FA_CHEVRON_UP", :rotation="toggle[index]?null:180")
              transition(v-if="toggle[index]", name="fade")
                div(:class="$style.children")
                  a.list-group-item.list-group-item-action(v-for="childCol in col.children", @click="goToCollection(childCol.url)") {{childCol.title}}
            a.list-group-item.list-group-item-action(v-else, @click="goToCollection(col.url)") {{col.title}}
        h5.mt-4.mb-4 INTERESTS
        .list-group
          //
          a.list-group-item.list-group-item-action(v-for="col in sidebarTags", href="javascript:void(0)" :class="{ [$bs.active]:(filteredTag && (col.title=== filteredTag.title)), [$style.active]: (filteredTag && (col.title=== filteredTag.title)) }", @click="goToTag(col.url)") {{col.title}}
      .col-sm-10.pr-3
        .row.no-gutter
          .col-6.col-sm-3.product-item(v-for="product in products")
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
        fragment-reviews(:items="group1")
        fragment-reviews(:items="group2")
</template>
<script>
  import collectionModule from '@/js/store/page-collections';
  import {mapActions, mapGetters} from 'vuex';
  import FragmentBreadcrumb from '@/js/fragments/collection__Breadcrumb';
  import {spreadModuleProps} from "@/js/plugins/helpers";
  import {ImagePair, Slider, ProductItem} from "@/js/components";
  import StarRating from 'vue-star-rating';
  import FragmentReviews from '@/js/fragments/app__Review'
  import FA_CHEVRON_UP from '@fortawesome/fontawesome-free-solid/faChevronUp'

  export default {
    storeModule: ['pageCollections', collectionModule],
    components: {
      FragmentBreadcrumb,
      ImagePair,
      Slider,
      StarRating,
      ProductItem,
      FragmentReviews,
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
      }
    },
    data() {
      return {
        toggle: Array(50).fill(false),
        FA_CHEVRON_UP
      }
    },
    computed: {
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
      toggleMenu(index) {
        // console.log(this.toggle);
        this.$set(this.toggle, index, !this.toggle[index])
      }
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
