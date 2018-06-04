import Shopify = require("shopify-api-node");

export default interface ShopifyWrapper {
  api: Shopify;

  _refineProductList(list: Shopify.IProduct[]);
}
