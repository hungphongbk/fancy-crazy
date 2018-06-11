import {createNamespacedHelpers} from "vuex";

const {mapGetters, mapActions} = createNamespacedHelpers('pageCollections');

export default {
  computed: mapGetters({
    SIDEBAR_COLLECTIONS: 'sidebarCollections',
    SIDEBAR_TAGS: 'sidebarTags',
    FILTERED_COLLECTION: 'filteredCollection',
    FILTERED_TAG: 'filteredTag'
  }),
  methods: mapActions({
    GO_TO_TAG: 'goToTag',
    GO_TO_COLLECTION: 'goToCollection'
  }),
  created(){
    console.log(this.$store.state.pageCollections.sidebar);
    console.log(this.SIDEBAR_COLLECTIONS);
  }
};
