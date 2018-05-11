declare global {
  interface PageIndexState {
    reviews: Array<any>
  }

  interface PageProductState {

  }

  interface RootState {
    pageIndex: PageIndexState
    pageProduct: PageProductState
  }
}

import {Store} from "vuex";

declare module "vue/types/vue" {
  interface Vue {
    $appStore?: Store<RootState>;
  }
}
