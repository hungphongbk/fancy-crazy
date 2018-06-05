declare module "*.json" {
  const value: any;
  export default value;
}

declare namespace App {
  import * as Shopify from "shopify-api-node";
  type Collection = Shopify.ICustomCollection | Shopify.ISmartCollection

  interface Product extends Shopify.IProduct {
    url: string
    prices: {
      original: number
      sale?: number
    }
  }
}
