//polyfill
import 'babel-runtime/regenerator';
import * as functions    from "firebase-functions";
import express           from "express";
import bodyParser        from 'body-parser';
import cors              from "cors";
import cacheControl      from 'express-cache-controller';
import shopify           from './Shopify.ts';
import ssr               from './SSR.ts';
import ReviewsController from './router/reviews';

const app = express();
app.use(cors({origin: true}));
app.use(cacheControl({
  maxAge: 7200
}));
app.use(bodyParser.urlencoded());

app.get('/products/:id/similar', (req, res) => {
  const product_id = req.params.id;

  shopify.productSimilar(product_id).then(resp => {
    let response = resp;
    if (req.query.top)
      response = response.slice(0, req.query.top * 1);
    res.json(response);
  });
});

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
app.get('/collections/:collection', getCollection, pagination({key: 'products'}));
app.get('/collections/:collection/:tag', getCollection, pagination({key: 'products'}));

app.use('/reviews', ReviewsController);

app.post('/ssr', async (req, res) => {
  // const url = req.body.url;
  await ssr.generateSSRContent();
  res.json({status: 'OK'});
});

export const s = functions.https.onRequest(app);

export const ssrUpload = functions.database.ref('server/ssr-bundle/obj')
  .onCreate((snapshot, context) => {

  });
