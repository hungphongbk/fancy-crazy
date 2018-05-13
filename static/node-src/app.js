import Spreadsheet from './Spreadsheet';
import path        from 'path';
import fs          from 'fs';
import groupBy     from 'lodash/groupBy';
import omit        from 'lodash/omit';
import Shopify     from 'shopify-api-node';

const s = new Spreadsheet(path.resolve(__dirname, '../dist/reviews.json')),
  shopify = new Shopify({
    shopName: 'cubachtung.myshopify.com',
    apiKey: 'fbe0d0ae67119ada8e18e0bdfcfb4eb3',
    password: '7f6a7e330da245f0049ff3a642e3abdc'
  });

const timeout = ms => new Promise(res => setTimeout(res, ms));

const cols = [];

async function transformItem(item) {
  if (item.type === 'image-with-data' && /^[0-9]+$/.test(item.collection_id)) {
    //console.log(item.collection_id);
    let col = cols[item.collection_id];
    if (!col)
      try {
        // console.log('new collection id, ' + item.collection_id);
        col = await shopify.customCollection.get(item.collection_id * 1);
      } catch (e) {
        col = await shopify.smartCollection.get(item.collection_id * 1);
      } finally {
        cols[item.collection_id] = col;
        if (!col.image) {
          console.log(`Collection "${col.title}" has no image`);
        }
      }
    item.image_url = col.image ? col.image.src : '';
  }
  return omit(item, ['position', 'collection_id']);
}

s.readSheetData()
  .then(async arr => {
    const filesObj = groupBy(arr, item => {
      if (item.position === 'index') return 'index';
      return 'collection-' + item.collection_id;
    });

    for (const [file, obj] of Object.entries(filesObj)) {
      const newObj = [];
      for (const item of obj) {
        newObj.push(await transformItem(item));
      }
      fs.writeFileSync(
        path.resolve(__dirname, `../dist/reviews-${file}.json`),
        JSON.stringify(newObj),
        'utf-8');
    }
    await timeout(500);
  });
