import {Router} from 'express';
//import {cacheableFunc} from "../utils";
import database from '../../firebase/database.babel';
import omit from 'lodash/omit';
import values from 'object.values';

const r = new Router(),
  db = database.ref('server/reviews');

const transformReviews = review => omit(review, ['collection_id', 'position', 'product_id']),
  pickData = (field, value) => new Promise(resolve => {
    db.orderByChild(field).equalTo(value).once('value', resolve);
  });

r.get('/collections/:id', (req, res) => {
  pickData('collection_id', req.params.id).then(snapshot => {
    res.json(values(snapshot.val() || []).map(transformReviews));
  });
});

r.get('/products/:id', (req, res) => {
  pickData('product_id', req.params.id).then(snapshot => {
    res.json(values(snapshot.val() || []).map(transformReviews));
  });
});

r.post('/products/:id', (req, res) => {

});

r.get('/index', (req, res) => {
  pickData('position', 'index').then(snapshot => {
    res.json(values(snapshot.val() || []).map(transformReviews));
  });
});

export default r;
