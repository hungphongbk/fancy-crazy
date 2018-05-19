import Spreadsheet from './Spreadsheet';
import path        from 'path';
import fs          from 'fs';
import groupBy     from 'lodash/groupBy';
import clone       from 'lodash/clone';
import omit        from 'lodash/omit';
import flatten     from 'lodash/flatten';
import random      from 'lodash/random';
import range       from 'lodash/range';
import Shopify     from 'shopify-api-node';

const s = new Spreadsheet(path.resolve(__dirname, '../dist/reviews.json')),
  shopify = new Shopify({
    shopName: 'cubachtung.myshopify.com',
    apiKey: 'fbe0d0ae67119ada8e18e0bdfcfb4eb3',
    password: '7f6a7e330da245f0049ff3a642e3abdc'
  });

const timeout = ms => new Promise(res => setTimeout(res, ms));

const cols = [], products = [];

async function task1() {
  async function getRandonlyProduct(collection_id) {
    if (!cols[collection_id]) {
      cols[collection_id] = await shopify.collect.list({collection_id, fields: 'collection_id,product_id'});
    }
    console.log(`id = ${collection_id} has ${cols[collection_id].length} collects`);
    // else console.log('cached');
    const collects = cols[collection_id];
    if (collects.length === 0) return null;
    let product_id;
    do {
      const index = random(collects.length - 1);
      product_id = collects[index].product_id;
    } while (typeof product_id === 'undefined');
    if (!products[product_id]) {
      products[product_id] = await shopify.product.get(product_id);
    }

    let i;
    do {
      i = random(products[product_id].images.length - 1);
    } while (/sizechart/.test(products[product_id].images[i].src));
    return products[product_id].images[i].src.replace('https://cdn.shopify.com', '');
  }

  async function transformItem(item) {
    if (item.type === 'image-with-data' && /^[0-9]+$/.test(item.collection_id)) {
      item.image_url = await getRandonlyProduct(item.collection_id);
    }
    return omit(item, ['position', 'collection_id']);
  }

  async function getAllCollections() {
    const fields = 'id,title';
    const [custom, smart] = await Promise.all([
      shopify.customCollection.list({fields, limit: 250}),
      shopify.smartCollection.list({fields, limit: 250})
    ]);
    return [].concat(custom, smart);
  }

  s.readSheetData()
    .then(async arr => {
      const collections = await getAllCollections(),
        remove = id => {
          const index = collections.findIndex(col => col.id * 1 === id * 1);
          if (index > -1) {
            console.log(`remove collection "${collections[index].BTN_TITLE}"`);
            collections.splice(index, 1);
          }
        };
      console.log(`fetch ${collections.length} collections`);

      let filesObj_ = {};
      for (const item of arr) {
        if (typeof item.collection_id !== 'undefined' && item.collection_id.length > 0) {
          for (const id of item.collection_id.split(',')) if (id.length > 0) {
            if (!filesObj_[id]) filesObj_[id] = [];

            const newItem = clone(item);
            newItem.collection_id = id;
            filesObj_[id].push(newItem);
          }
        }
      }
      filesObj_ = flatten(Object.values(filesObj_));
      const filesObj = groupBy(filesObj_, item => {
        if (item.position === 'index') return 'index';
        return 'collection-' + item.collection_id;
      });

      for (const [file, obj] of Object.entries(filesObj)) {
        const newObj = [];
        for (const item of obj) {
          newObj.push(await transformItem(item));
          remove(item.collection_id);
        }
        fs.writeFileSync(
          path.resolve(__dirname, `../dist/reviews-${file}.json`),
          JSON.stringify(newObj),
          'utf-8');
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

task2().then(() => {
  console.log('completed');
});
