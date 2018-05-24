import store2 from 'store2';
import cart   from "@/js/store/cart";

export default store => {
  //add menu to more
  const createMenu = (title, url) => ({title, url}),
    moreMenu = __state__.menu.list.find(m => m.handle === 'more');
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

  if (__state__.pageProduct)
    __state__.pageProduct.selectedImage = 0;

  store.replaceState(Object.assign({}, store2.get('vuex', {}), __state__, {
    lockScroll: false,
    cart: cart.state()
  }));
}
