import store2 from 'store2';
import cart   from "@/js/store/cart";
import {win}  from "@/js/global";

export default store => {
  const w = win();
  //add menu to more
  const createMenu = (title, url) => ({title, url}),
    moreMenu = w.__state__.menu.list.find(m => m.handle === 'more');
  // debugger;
  moreMenu.isTextOnly = true;
  moreMenu.children.push(...[
    createMenu('Blog', 'https://fancycrazy.com/blogs/news'),
    createMenu('Size Chart', 'https://fancycrazy.com/blogs/news'),
    createMenu('Customer Review', 'https://fancycrazy.com/pages/customer-reviews'),
    createMenu('Help Center', 'https://fancycrazy.com/apps/help-center'),
    createMenu('Track your Order', 'http://fancycrazy.aftership.com'),
    createMenu('About Us', 'https://fancycrazy.com/pages/about-us')
  ]);

  if (w.__state__.pageProduct)
    w.__state__.pageProduct.selectedImage = 0;

  store.replaceState(Object.assign({}, w.__state__, store2.get('vuex', {}), {
    lockScroll: false,
    cart: cart.state()
  }));
}
