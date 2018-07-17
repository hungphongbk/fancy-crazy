import {createNamespacedHelpers} from "vuex";
import Dropdown from '@/js/components/universal/dropdown'

const {mapGetters, mapActions} = createNamespacedHelpers('pageCollections');

export default {
  components:{
    Dropdown,
    SidebarItem: {
      functional: true,
      render(h, {props, parent, children}) {
        const bs = parent.$bs,
          classes = {
            [bs.listGroupItem]: true,
            [bs.listGroupItemAction]: true,
            [bs.active]: props.index === parent.toggle,
            [parent.$style.active]: props.index === parent.toggle,
          },
          onClick = () => {
            parent.TOGGLE_MENU(props.index);
            parent.GO_TO_COLLECTION(props.item.url);
          };
        return (<a class={classes} href="javascript:void(0)" onClick={onClick}>{children}</a>)
      }
    }
  },
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
  created() {
    console.log(this.$store.state.pageCollections.sidebar);
    console.log(this.SIDEBAR_COLLECTIONS);
  }
};
