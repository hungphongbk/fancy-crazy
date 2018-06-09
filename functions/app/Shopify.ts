import ShopifyApi   from "shopify-api-node";
// import GraphQL from "./GraphQL"
import {cacheable}  from "./utils";
import remove       from 'lodash/remove';
import flatten      from 'lodash/flatten';
import uniqBy       from 'lodash/uniqBy';
import intersection from 'lodash/intersectionBy';
import BindAll      from 'lodash-decorators/bindAll';

const shopify = new ShopifyApi({
  shopName: 'cubachtung.myshopify.com',
  apiKey: 'fbe0d0ae67119ada8e18e0bdfcfb4eb3',
  password: '7f6a7e330da245f0049ff3a642e3abdc',
});

// const cacheKey: (string) => Promise<string> = key => new Promise(resolve => {
//   const unique = md5(key) as string;
//   cacheRefDb.once('value', snapshot => {
//     if (snapshot.hasChild(unique)) {
//       resolve(unique);
//     } else {
//       cacheRefDb.child(unique).set(key).then(() => {
//         resolve(unique);
//       });
//     }
//   });
// });

@BindAll()
class ShopifyWrapper {
  get api() {
    return shopify;
  }

  _refineImageUrl(img) {
    return img.replace('https://cdn.shopify.com', '');
  }

  _refineProductItem(elem): App.Product {
    if (elem.handle)
      elem.url = '/products/' + elem.handle;
    if (elem.images) {
      elem.images = elem.images.map(img => img.src).map(this._refineImageUrl);
    }
    if (elem.variants) {
      const variant = elem.variants[0];
      if (variant.compare_at_price !== null) {
        elem.prices = {
          original: variant.compare_at_price * 100,
          sale: variant.price * 100,
        };
      } else {
        elem.prices = {
          original: variant.price * 100,
        };
      }
      delete elem.variants;
    }
    return elem;
  }

  _refineProductList(list): App.Product[] {
    return list.map(this._refineProductItem);
  }

  @cacheable()
  productGetCollects(product_id) {
    return shopify.collect.list({
      product_id,
      fields: 'collection_id,product_id',
    });
  }

  @cacheable()
  productGet(id, params = {}) {
    return shopify.product.get(id, params);
  }

  @cacheable(0)
  productList(ids, params = {}) {
    return shopify.product.list({
      ids: ids.join(','),
      ...params,
    }).then(this._refineProductList);
  }

  @cacheable(3600)
  async productSimilar(product_id) {
    const collects = await this.productGetCollects(product_id),
      collections = await Promise.all(collects.map(async c => {
        const fields = 'id,handle';

        return await this.collectionGet(c.collection_id, {fields});
      })),
      comparator = remove(collections, c => {
        return /^(best-selling|newest)/.test(c.handle);
      });

    // pick best-selling-collections vs newest-collections
    remove(comparator, c => {
      return !/^best-selling/.test(c.handle);
    });

    // transform collections to products
    const products = uniqBy(
      flatten(await Promise.all(collections.map(
        col => this.collectionGetProducts(col.id * 1, {
          fields: 'id,title,handle,images,variants',
        }),
      )))
      , 'id');
    if (!Array.isArray(comparator) || comparator.length === 0 || comparator[0] === null)
      return products;

    const comparatorProducts = await this.collectionGetProducts(comparator[0].id * 1, {
      fields: 'id,title,handle,images',
    });

    return intersection(products, comparatorProducts, 'id');
  }

  @cacheable()
  async collectionGet(id, params = {}): Promise<App.Collection> {
    try {
      return await shopify.smartCollection.get(id, params);
    } catch (e) {
      return await shopify.customCollection.get(id, params);
    }
  }

  @cacheable()
  async collectionGetByHandle(handle, params = {}): Promise<App.Collection> {
    const query = Object.assign({}, {handle}, params);

    let collections: App.Collection[] = await shopify.smartCollection.list(query);
    if (collections.length === 0)
      collections = await shopify.customCollection.list(query);

    const rs = collections.filter(collection => collection.handle === handle)[0];
    if (typeof rs === 'undefined')
      console.error(`handle "${handle}" returns undefined`);
    return rs || null;
  }

  @cacheable()
  collectionGetCollects(collection_id) {
    return shopify.collect.list({
      collection_id,
      fields: 'collection_id,product_id',
    });
  }

  @cacheable()
  collectionGetProducts(id: number | string, params = {}): Promise<App.Product[]> {

    const getId = new Promise(resolve => {
      if (typeof id === "number" || /^[0-9]+$/.test(id)) {
        resolve(id);
        return;
      }
      return this.collectionGetByHandle(id)
        .then(collection => resolve(collection.id));
    });

    return getId
      .then(this.collectionGetCollects)
      .then(collects => collects.map(c => c.product_id))
      .then(ids => this.productList(ids, params));
  }

  async SSR(url, responsive, source) {
    const metafields = await shopify.metafield.list({
      namespace: 'fancyCrazySSR',
      key: `${responsive}-${url.replace(/\//g, '')}`,
    });
    if (metafields.length === 0) {
      await shopify.metafield.create({
        namespace: 'fancyCrazySSR',
        key: `${responsive}-${url.replace(/\//g, '')}`,
        value: source,
        value_type: 'string',
      });
    } else {
      await shopify.metafield.update(metafields[0].id, {
        value: source,
      });
    }
  }
}

export default new ShopifyWrapper();
