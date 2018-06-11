import {Router} from 'express';
//import {cacheableFunc} from "../utils";
import database from '../../firebase/database.babel';
import omit     from 'lodash/omit';
import values   from 'object.values';

const r = new Router(),
  db = database.ref('server/reviews');

const transformReviews = review => omit(review, ['collection_id', 'position']);

r.get('/collections/:id', (req, res) => {
  db.orderByChild('collection_id').equalTo(req.params.id).once('value', data => {
    res.json(values(data.val()).map(transformReviews));
  });
});

export default r;
