import shopify     from './Shopify';
import {cacheable} from "./utils";

function handleize(str) {
  str = str.toLowerCase();

  const toReplace = ['"', "'", "\\", "(", ")", "[", "]"];

  // For the old browsers
  for (let i = 0; i < toReplace.length; ++i) {
    str = str.replace(toReplace[i], "");
  }

  str = str.replace(/\W+/g, "-");

  if (str.charAt(str.length - 1) == "-") {
    str = str.replace(/-+\z/, "");
  }

  if (str.charAt(0) == "-") {
    str = str.replace(/\A-+/, "");
  }

  return str;
}

const receiveMenu = (handle, includeImg = false) => shopify.collectionGetByHandle(handle)
  .then(collection => {
    const rs: any = {
      title: collection.title,
      handle: collection.handle,
      url: '/collections/' + collection.handle,
    };
    if (includeImg)
      rs.image = shopify._refineImageUrl(collection.image.src);
    return rs;
  });

class SSR {
  @cacheable(86400)
  async generateMenu() {
    const menu = {
      'apparel': 'Native Culture Tshirt|Animal Spirit Blankets|Leggings',
      '3d-art': 'Wolf Hoodie|Native Bomber Jacket|Pet Tshirt',
      'shoes': 'Boots Shoes|Sneakers|Top Shoes|Low Tops|Slip Ons',
      /* HOME DECOR */
      'pillow': 'Dreamcatcher Beddings|Feather Pillow|Spiritual Hippie Bedding',
      /* ACCESSORIES */
      'jewelry': 'Bag Collections|Car Seat Covers|Jewelry Collections',
      'native-handmade': 'Dreamcatcher Handmade|Hippie Handmade|Native Handmade 1',
    };

    //handleize menu
    for (const key of Object.keys(menu))
      menu[key] = menu[key].split('|').map(handleize);

    const menuObj = [];
    for (const key of Object.keys(menu)) {
      const menuItem = await receiveMenu(key);
      if (menu[key].length > 0)
        menuItem.children = await Promise.all(menu[key].map(handle => receiveMenu(handle, true)));
      menuObj.push(menuItem);
    }

    //add home
    menuObj.unshift({
      title: 'Home',
      handle: '',
      url: '/',
    });
    menuObj.push({
      title: 'More',
      handle: 'more',
      url: '/',
      children: [],
    });

    return menuObj;
  }

  async generateIndexPageState() {
    const collectionList = 'Native Apparel|Animal Spirit Bedding|Hippie Car Seat Covers|Dreamcatcher Saddle Bag|Yoga Leggings|Christian necklace|Pet Hightop'.split('|').map(handleize);
    const featuredCollectionList = 'Bed|Native Apparel|Dreamcatcher Legging|Hippe Car Seat Cover'.split('|').map(handleize);
    return {
      pageIndex: {
        collections: await Promise.all(collectionList.map(handle => receiveMenu(handle, true))),
        featuredProducts: await Promise.all(featuredCollectionList.map(handle => shopify.collectionGetProducts(handle, {
          fields: 'id,title,handle,images,variants',
        }))),
      },
    };
  }

  determineTemplate(url) {
    if (/^\/($|\?)/.test(url)) return 'index';

    return '';
  }

  async generateStateTree(url = '/') {
    const template = this.determineTemplate(url),
      menu = await this.generateMenu();

    return {
      template,
      menu: {
        list: menu,
      },
      recently: [],
      mq: {},
      isLoading: false,
      ...await this.generateIndexPageState(),
    };
  }
}

export default new SSR();
