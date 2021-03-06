import store2 from 'store2';
import cart from "@/js/store/cart";
import {win} from "@/js/global";

export default store => {
  const w = win();
  //add menu to more
  const createMenu = (title, url) => ({title, url}),
    moreMenu = w.__state__.menu.list.find(m => m.handle === 'more');
  // debugger;
  moreMenu.isTextOnly = true;
  if (!moreMenu.children) moreMenu.children = [];
  moreMenu.children.push(...[
    createMenu('Blog', 'https://welcomenative.com/blogs/news'),
    createMenu('Size Chart', 'https://welcomenative.com/blogs/news'),
    createMenu('Customer Review', 'https://welcomenative.com/pages/customer-reviews'),
    createMenu('Help Center', 'https://welcomenative.com/apps/help-center'),
    createMenu('Track your Order', 'http://fancycrazy.aftership.com'),
    createMenu('About Us', 'https://welcomenative.com/pages/about-us')
  ]);

  if (w.__state__.pageIndex) {
    const pageIndex = w.__state__.pageIndex;
    if (!pageIndex.reviews)
      pageIndex.reviews = {
        group1: [],
        group2: [],
        group3: []
      };
  }

  if(w.__state__.pageCollections){
    w.__state__.pageCollections.isBestSelling=false;
  }

  if (w.__state__.pageProduct)
    w.__state__.pageProduct.selectedImage = 0;

  store.replaceState(Object.assign({}, w.__state__, store2.get('vuex', {}), {
    lockScroll: false,
    cart: cart.state()
  }));
}
