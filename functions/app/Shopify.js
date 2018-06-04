// @flow
import ShopifyApi   from "shopify-api-node";
// import GraphQL from "./GraphQL"
import admin        from 'firebase-admin';
import cert         from './cred/fancycrazy-895ba-firebase-adminsdk-c73dr-2f62366df5.json';
import md5          from 'md5';
import remove       from 'lodash/remove';
import flatten      from 'lodash/flatten';
import uniqBy       from 'lodash/uniqBy';
import intersection from 'lodash/intersectionBy';
// import {gql} from 'babel-plugin-graphql-js-client-transform';

admin.initializeApp({
  credentials: admin.credential.cert(cert),
  databaseURL: "https://fancycrazy-895ba.firebaseio.com"
});

const shopify = new ShopifyApi({
    shopName: 'cubachtung.myshopify.com',
    apiKey: 'fbe0d0ae67119ada8e18e0bdfcfb4eb3',
    password: '7f6a7e330da245f0049ff3a642e3abdc'
  }),
  db = admin.database(),
  cacheDb = db.ref('server/cache'),
  cacheRefDb = db.ref('server/cacheMap');

const cacheKey = key => new Promise(resolve => {
  const unique = md5(key);
  cacheRefDb.once('value', snapshot => {
    if (snapshot.hasChild(unique)) {
      resolve(unique);
    } else {
      cacheRefDb.child(unique).set(key).then(() => {
        resolve(unique);
      });
    }
  });
});

//decorator
const cacheable = (expiration = 60) =>
  (target, name, descriptor) => {
    const original = descriptor.value;
    if (typeof original === 'function') {
      descriptor.value = async function (...args) {
        const key = await cacheKey(name + '?' + JSON.stringify(args));

        const cached = await (new Promise(resolve => {
          cacheDb.child(key).once('value', v => resolve(
            v.exists() ? v.val() : null
          ));
        }));
        if (cached !== null) return Promise.resolve(cached.value);

        return original.apply(this, args).then(value => new Promise(resolve => {
          return cacheDb.child(key).update({
            value,
            expiration: expiration * 1000,
            createdAt: (new Date()).getTime()
          }).then(() => resolve(value));
        }));
      };
    }
    return descriptor;
  };

export default class ShopifyWrapper {
  get api() {
    return shopify;
  }

  _refineProductList(list) {
    return list.map(elem => {
      if (elem.images) {
        elem.images = elem.images.map(img => img.src);
      }
      if (elem.variants) {
        const variant = elem.variants[0];
        if (variant.compare_at_price !== null) {
          elem.prices = {
            original: variant.compare_at_price * 100,
            sale: variant.price * 100
          };
        } else {
          elem.prices = {
            original: variant.price * 100
          };
        }
        delete elem.variants;
      }
      return elem;
    });
  }

  @cacheable()
  productGetCollects(product_id) {
    return shopify.collect.list({
      product_id,
      fields: 'collection_id,product_id'
    });
  }

  @cacheable()
  productGet(id, params = {}) {
    return shopify.product.get(id, params);
  }

  @cacheable()
  productList(ids, params = {}) {
    return shopify.product.list({
      ids: ids.join(','),
      ...params
    }).then(this._refineProductList);
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
        col => this.collectionGetProducts(col.id, {
          fields: 'id,title,handle,images,variants'
        })
      )))
      , 'id');
    if (!Array.isArray(comparator) || comparator.length === 0)
      return products;

    const comparatorProducts = await this.collectionGetProducts(comparator[0].id, {
      fields: 'id,title,handle,images'
    });

    return intersection(products, comparatorProducts, 'id');
  }

  @cacheable()
  async collectionGet(id, params = {}) {
    try {
      return await shopify.smartCollection.get(id, params);
    } catch (e) {
      return await shopify.customCollection.get(id, params);
    }
  }

  @cacheable()
  collectionGetCollects(collection_id) {
    return shopify.collect.list({
      collection_id,
      fields: 'collection_id,product_id'
    });
  }

  @cacheable()
  collectionGetProducts(id, params = {}) {
    return this.collectionGetCollects(id)
      .then(collects => collects.map(c => c.product_id))
      .then(ids => this.productList(ids, params));
  }
}
