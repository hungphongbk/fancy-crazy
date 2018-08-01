import ShopifyApi from "shopify-api-node";
// import GraphQL from "./GraphQL"
import {cacheable} from "./utils";
import remove from 'lodash/remove';
import flatten from 'lodash/flatten';
import uniqBy from 'lodash/uniqBy';
import range from 'lodash/range'
import intersection from 'lodash/intersectionBy';
import chunk from 'lodash/chunk'
import BindAll from 'lodash-decorators/bindAll';
import omit from 'lodash/omit';
// import cacher from './ShopifyCacher'

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

  @cacheable()
  async productList(_ids, params = {}): Promise<App.Product[]> {
    const __ids = chunk(_ids, 50).map(ids => ids.join(','));

    return flatten(await Promise.all(__ids.map((ids) =>
      shopify.product.list({
        ids,
        ...params
      }).then(this._refineProductList))
    ));
  }

  @cacheable()
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
        }, true),
      )))
      , 'id');
    if (!Array.isArray(comparator) || comparator.length === 0 || comparator[0] === null)
      return products;

    const comparatorProducts = await this.collectionGetProducts(comparator[0].id * 1, {
      fields: 'id,title,handle,images',
    }, true);

    return intersection(products, comparatorProducts, 'id').slice(0, 50);
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
  async collectionBestSelling(): Promise<App.Collection> {
    const query = {
      title: 'Best Selling'
    };
    let collections: App.Collection[] = await shopify.smartCollection.list(query);
    if (collections.length === 0)
      throw new Error('Best Selling not found');
    return collections[0];
  }

  @cacheable()
  async collectionGetCollects(collection_id, onlyFirstPage: boolean = false) {
    const params = {
        collection_id,
        fields: 'collection_id,product_id',
        limit: 250
      },
      count = onlyFirstPage ? 0 : (await shopify.collect.count(params)),
      pages = Math.ceil(count / 250);

    return flatten(await Promise.all(
      range(1, pages + 1).map(page => shopify.collect.list({
        ...params,
        page
      }))
    ));
  }

  @cacheable(86400 * 8)
  // @cacheable(0)
  collectionGetProducts(id: number | string, params = {}, onlyFirstPage: boolean = false): Promise<App.Product[]> {

    const _params = omit(params, ['tag']),
      hasTagFilter = params.hasOwnProperty('tag'),
      getId = new Promise(resolve => {
        if (typeof id === "number" || /^[0-9]+$/.test(id)) {
          resolve(id);
          return;
        }
        return this.collectionGetByHandle(id)
          .then(collection => resolve(collection.id));
      });

    if (hasTagFilter && _params.hasOwnProperty('fields')) {
      _params['fields'] += ',tags';
    }

    let promise = getId
      .then(id => this.collectionGetCollects(id, onlyFirstPage))
      .then(collects => collects.map(c => c.product_id))
      .then(ids => this.productList(ids, _params));

    // if has tag, filter products by tag
    if (hasTagFilter) {
      promise = promise.then(products => {
        return products.filter(product => {
          //get product tags
          const tags = product.tags
            .split(',')
            .map(tag => tag.trim().toLowerCase());
          return tags.indexOf(params['tag']) >= 0;
        });
      });
    }

    return promise;
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
