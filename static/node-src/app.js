// @flow
import Spreadsheet   from './Spreadsheet';
import ImgCompressor from './ImgCompressor';
import cache         from './Cache';
import path          from 'path';
import fs            from 'fs';
import groupBy       from 'lodash/groupBy';
import clone         from 'lodash/clone';
import omit          from 'lodash/omit';
import flatten       from 'lodash/flatten';
import random        from 'lodash/random';
import range         from 'lodash/range';
import chunk         from 'lodash/chunk';
import transform     from 'lodash/transform';
import Shopify       from 'shopify-api-node';
import Bluebird      from 'bluebird';

//region Somethings
const cacheGet = Bluebird.promisify(cache.get, {context: cache}),
  cacheSet = Bluebird.promisify(cache.set, {context: cache});

const s = new Spreadsheet(path.resolve(__dirname, '../dist/reviews.json')),
  shopify = new Shopify({
    shopName: 'cubachtung.myshopify.com',
    apiKey: 'fbe0d0ae67119ada8e18e0bdfcfb4eb3',
    password: '7f6a7e330da245f0049ff3a642e3abdc'
  });

const TTL = 2592000,
  timeout = ms => new Promise(res => setTimeout(res, ms));


function retry(fn, max = 2) {
  return new Promise(async (resolve, reject) => {
    let retryCounter = 0;
    while (true) {
      try {
        resolve(await fn());
        break;
      } catch (e) {
        console.log(`Retry ${++retryCounter}`);
        if (retryCounter >= max) {
          reject();
          break;
        }
      }
    }
  });
}

//endregion

async function getAllCollections() {
  const fields = 'id,title,handle';
  const [custom, smart] = await Promise.all([
    shopify.customCollection.list({fields, limit: 250}),
    shopify.smartCollection.list({fields, limit: 250})
  ]);
  return [].concat(custom, smart);
}

async function task1() {
  async function getRandomlyProduct(collection_id) {
    let collects = await cacheGet(collection_id);
    if (!collects) {
      console.log('[App] start caching collects from collection_id=' + collection_id);
      try {
        collects = await retry(() => shopify.collect.list({collection_id, fields: 'collection_id,product_id'}));
        await cacheSet(collection_id, collects, TTL);
      } catch (e) {
        return '';
      }
    }

    if (collects.length === 0) return null;
    let product_id;
    do {
      const index = random(collects.length - 1);
      product_id = collects[index].product_id;
    } while (typeof product_id === 'undefined');

    //get product from product_id
    let product = await cacheGet(product_id);
    if (!product) {
      console.log('[App] start caching product, product_id=' + product_id);
      product = await retry(() => shopify.product.get(product_id));
      await cacheSet(product_id, product, TTL);
    }

    let i, counter = 0, images = product.images;
    do {
      i = random(images.length - 1);
    } while (!(images[i] && (!/sizechart/.test(images[i].src))) && ++counter < images.length * 2);
    if (counter >= images.length * 2) {
      console.log('cannot get random only product on ' + collection_id);
      return '';
    }
    return images[i].src.replace('https://cdn.shopify.com', '');
  }

  async function transformItem(item) {
    // debugger;
    if (item.type === 'image-with-data' && /^[0-9]+$/.test(item.collection_id)) {
      item.image_url = await getRandomlyProduct(item.collection_id);
    } else if (item.type === 'image-only' && /thenativesite/.test(item.image_url)) {
      item.image_url = await ImgCompressor.generateImageSet(item.image_url);
    }
    return omit(item, ['position', 'collection_id']);
  }

  await s.readSheetData()
    .then(async arr => {
      const collections = await getAllCollections(),
        remove = id => {
          const index = collections.findIndex(col => col.id * 1 === id * 1);
          if (index > -1) {
            console.log(`remove collection "${collections[index].title}"`);
            collections.splice(index, 1);
          }
        };
      console.log(`fetch ${collections.length} collections`);

      let filesObj_ = {
        index: []
      };
      for (const item of arr) {
        if (typeof item.collection_id !== 'undefined' && item.collection_id.length > 0) {
          const ids = item.collection_id.split(',')
            .map(id => id.trim())
            .filter(id => id.length > 0);
          for (const id of ids) if (id.length > 0) {
            if (!filesObj_[id]) filesObj_[id] = [];

            const newItem = clone(item);
            newItem.collection_id = id;
            filesObj_[id].push(newItem);
          }
        } else if (item.position === 'index') {
          filesObj_.index.push(item);
        }
      }
      filesObj_ = flatten(Object.values(filesObj_));
      const filesObj = groupBy(filesObj_, item => {
        if (item.position === 'index') return 'index';
        return 'collection-' + item.collection_id;
      });

      for (const [file, obj] of Object.entries(filesObj)) {
        const newObj = [];
        for (const items of chunk(obj, 1)) {
          const transformed = await Promise.all(items.map(transformItem));
          newObj.push(...transformed);
          // remove(item.collection_id);
          items.forEach(({collection_id}) => remove(collection_id));
        }
        fs.writeFileSync(
          path.resolve(__dirname, `../dist/reviews-${file}.json`),
          JSON.stringify(newObj),
          'utf-8');
        console.log(`reviews-${file}.json has been written`);
        // await timeout(500);
      }

      //get collections that doesn't have reviews
      for (const {id, title} of collections) {
        console.log(`Collection "${title}" - id=${id} has no reviews`);
      }
    });
}

async function task2() {
  const findColorOption = options => options.find(o => o.name.toLowerCase() === 'color');

  const colors = {};
  const count = await shopify.product.count(),
    requestCount = Math.ceil(count / 250);
  const products = flatten(await Promise.all(range(1, requestCount + 1).map(page =>
    shopify.product.list({
      fields: 'id,handle,options',
      page,
      limit: 250
    })
  )));
  console.log(count + ' ' + products.length);
  for (const {id, handle: title, options} of products) if (options) {
    const colorOption = findColorOption(options);
    if (colorOption && colorOption.values) {
      for (const _val of colorOption.values) {
        const val = _val.toLowerCase();
        if (!colors[val]) {
          console.log(`${id} - ${title} has color ${val}`);
          colors[val] = '';
        }
      }
    }
  }

  fs.writeFileSync(
    path.resolve(__dirname, `../src/json/colors.json`),
    JSON.stringify(colors),
    'utf-8');
}

//test only
async function task3() {
  const rs = await Promise.all([
    'http://thenativesite.com/wp-content/uploads/2018/05/6cf420c76ba2632837984a816b63ca81.jpg',
    'http://thenativesite.com/wp-content/uploads/2018/05/southwest_navajo_handbag_01.jpg'
  ].map(ImgCompressor.generateImageSet));
  console.log(rs);
}

async function task4() {
  const cols: Array<string> = transform({
    'apparel': 'tshirt,hooded-blanket,leggings,hat,bomber-jacket',
    '3d-art': '3d-hoodie,3d-tshirt,3d-dress,3d-skirt',
    'shoes': 'boots-shoes,top-shoes,low-tops,sneakers,slip-ons',
    'car-seat-covers': '',
    'bed': '',
    'pillow': 'feather-pillow,canvas,mug,clock-wall',
    'jewelry': 'jewelry-1,watch,phone-cases,luggage-covers',
    'bag-1': 'saddle-bag,leather-bag,tote-bag',
    'native-handmade': ''
  }, (rs, value, key) => {
    rs.push(key);
    rs.push(...value.split(',').filter(v => v.length > 0));
  }, []),
    tags = transform({
      native: 'Native American',
      hippie: 'Spiritual Hippie',
      animal: 'Animal Spirit',
      pet: 'Pets',
      dreamcatcher: 'Dreamcatcher',
      yoga: 'Yoga',
      christian: 'Christian'
    }, (rs, value, key) => {
      rs.push({
        type: 'tags',
        title: value,
        url: key
      });
    }, []);

  const all = await getAllCollections();

  // transform cols to metafield object, and push tag items
  const metaObj = cols.map(handle => {
    const title = all.find(col => col.handle === handle).title;
    return {
      type: 'categories',
      title,
      url: handle
    };
  });
  metaObj.push(...tags);

  const meta = await shopify.metafield.list({
    namespace: 'fancyCrazyCols',
  });
  if (typeof meta === 'undefined' || !Array.isArray(meta) || meta.length === 0) {
    await shopify.metafield.create({
      namespace: 'fancyCrazyCols',
      key: 'sidebar',
      value: JSON.stringify(metaObj),
      value_type: 'string'
    });
  } else {
    await shopify.metafield.update(meta[0].id, {
      value: JSON.stringify(metaObj)
    });
  }
}

task4().then(() => {
  console.log('completed');
});
