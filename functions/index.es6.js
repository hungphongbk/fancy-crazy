import * as functions from "firebase-functions";
import express        from "express";
import cors           from "cors";
import ShopifyApi     from "shopify-api-node";

const shopify = new ShopifyApi({
  shopName: 'cubachtung.myshopify.com',
  apiKey: 'fbe0d0ae67119ada8e18e0bdfcfb4eb3',
  password: '7f6a7e330da245f0049ff3a642e3abdc'
});

const app = express();
app.use(cors({origin: true}));

app.get('/products/:id/similar', async (req, res) => {
  const product_id = req.params.id;

  // fetch collects from product id
  const collects = await shopify.collect.list({product_id, fields: 'product_id,collection_id'});
});

exports.s = functions.https.onRequest(app);
