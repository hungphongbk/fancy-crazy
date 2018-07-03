//polyfill
import 'babel-runtime/regenerator';
import * as functions from "firebase-functions";
import express from "express";
import bodyParser from 'body-parser';
import cors from "cors";
import cacheControl from 'express-cache-controller';
import shopify from './Shopify.ts';
import ReviewsController from './router/reviews';
import CollectionsController from './router/collections';
//import morgan from 'morgan'

const app = express();
// app.use(morgan('combined'));
app.use(cors({
  origin: 'https://fancycrazy.com',
  optionsSuccessStatus: 200
}));
app.use(cacheControl({
  maxAge: 7200
}));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/products/:id/similar', (req, res) => {
  const product_id = req.params.id;

  shopify.productSimilar(product_id).then(resp => {
    let response = resp;
    if (req.query.top)
      response = response.slice(0, req.query.top * 1);
    res.json(response);
  });
});

app.use('/collections', CollectionsController);

app.use('/reviews', ReviewsController);

export const s = functions.https.onRequest(app);
