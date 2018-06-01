declare global {
  const SHOPIFY_THEME_ID: string;

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
    $appStore?: Store<RootState>
    $bs: {
      [key: string]: string
    }
    $style: {
      [key: string]: string
    }
  }
}
