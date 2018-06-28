import qs from 'query-string';
import store from 'store2';
import {logger} from "@/js/plugins/logger";

const storage = store.namespace('ajax', false).session;


export const get = (url, useSession = false) => new Promise((resolve, reject) => {
  if (useSession && storage.has(url)) {
    resolve(storage.get(url));
    return;
  }
  jQuery.ajax({
      url,
      type: 'GET',
      contentType: 'json',
      dataType: 'json'
    })
    .then(body => {
      storage.set(url, body);
      resolve(body);
    })
    .catch(e => {
      logger.captureException(e);
      reject(e);
    });
});

export const post = (url, data) => new Promise((resolve, reject) => {
  jQuery.ajax({
      url,
      type: 'POST',
      // contentType: 'json',
      dataType: 'json',
      data: qs.stringify(data)
    })
    .then(resolve)
    .catch(e => {
      logger.captureException(e);
      reject(e);
    });
});
