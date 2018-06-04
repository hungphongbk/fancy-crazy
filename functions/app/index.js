//polyfill
import 'babel-runtime/regenerator';
import * as functions from "firebase-functions";
import express        from "express";
import cors           from "cors";
import cacheControl   from 'express-cache-controller';
import Shopify        from './Shopify';

const shopify = new Shopify();

const app = express();
app.use(cors());
app.use(cacheControl({
  maxAge: 3600
}));

app.get('/products/:id/similar', async (req, res) => {
  const product_id = req.params.id;

  let response = await shopify.productSimilar(product_id);
  if (req.query.top)
    response = response.slice(0, req.query.top * 1);
  res.json(response);
});

export const s = functions.https.onRequest(app);
