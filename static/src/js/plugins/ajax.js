import $ from 'jquery';
import qs from 'query-string';
import store from 'store2';

const storage = store.namespace('ajax', false).session;


export const get = (url, useSession = false) => new Promise((resolve, reject) => {
  if (useSession && storage.has(url)) {
    resolve(storage.get(url));
    return;
  }
  $.ajax({
    url,
    type: 'GET',
    contentType: 'json',
    dataType: 'json'
  }).then(body => {
    storage.set(url, body);
    resolve(body);
  }).catch(reject);
});

export const post = (url, data) => $.ajax({
  url,
  type: 'POST',
  // contentType: 'json',
  dataType: 'json',
  data: qs.stringify(data)
});
