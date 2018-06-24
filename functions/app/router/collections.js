import {Router} from 'express'
import shopify from '../Shopify.ts';


const r = new Router();

const getCollection = (req, res, next) => {
  const {collection, tag} = req.params,
    params = {
      fields: 'id,title,handle,images,variants,tags'
    };

  if (typeof tag === 'string')
    params.tag = tag;

  Promise.all([
    shopify.collectionGetByHandle(collection),
    shopify.collectionGetProducts(collection, params)
  ]).then(([collectionObj, products]) => {
    let title = collectionObj.title;
    // if (typeof tag === 'string')
    //   title += ` - Tagged "${tag}"`;

    res.obj = {
      id: collectionObj.id,
      title,
      products
    };
    next();
  });
};
const pagination = ({perPage = 24, key = null}) => (req, res) => {
  const page = req.query.page ? req.query.page : 1,
    start = (page - 1) * perPage,
    countItems = res.obj[key].length;

  // console.log(start + ' ' + perPage);
  res.obj[key] = res.obj[key].slice(start, start + perPage);
  res.obj.total = countItems;
  res.obj.totalPages = Math.ceil(countItems / perPage);
  res.json(res.obj);
};

r.get('/best-selling', async (req, res, next) => {
  const params = {
    fields: 'id,title,handle,images,variants,tags'
  };
  const bestSelling = await shopify.collectionBestSelling(),
    products = await shopify.collectionGetProducts(bestSelling.id, params);

  res['obj'] = {
    id: bestSelling.id,
    title: bestSelling.title,
    products
  };
  next();
}, pagination({key: 'products'}));
r.get('/:collection', getCollection, pagination({key: 'products'}));
r.get('/:collection/:tag', getCollection, pagination({key: 'products'}));

export default r;
