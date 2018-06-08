//polyfill
import 'babel-runtime/regenerator';
import * as functions from "firebase-functions";
import express        from "express";
import bodyParser     from 'body-parser';
import cors           from "cors";
import cacheControl   from 'express-cache-controller';
import shopify        from './Shopify.ts';
import ssr            from './SSR.ts';

const app = express();
app.use(cors({origin: true}));
app.use(cacheControl({
  maxAge: 3600
}));
app.use(bodyParser.urlencoded());

app.get('/products/:id/similar', async (req, res) => {
  const product_id = req.params.id;

  let response = await shopify.productSimilar(product_id);
  if (req.query.top)
    response = response.slice(0, req.query.top * 1);
  res.json(response);
});

app.post('/ssr', async (req, res) => {
  // const url = req.body.url;
  await ssr.generateSSRContent();
  res.json({status: 'OK'});
});

export const s = functions.https.onRequest(app);

export const ssrUpload = functions.database.ref('server/ssr-bundle/obj')
  .onCreate((snapshot, context) => {

  });
