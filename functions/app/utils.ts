import md5 from 'md5';
import db from '../firebase/database.babel';
// import PubSub from '@google-cloud/pubsub'

const cacheDb = db.ref('server/cache');

const cacheKey = key => md5(key);

// const sendCacheMessage = ([key, name, args], topic = 'cron') => new Promise((resolve, reject) => {
//   {
//     const pubsub = new PubSub(),
//       dataBuffer = Buffer.from(JSON.stringify({key, name, args}));
//     pubsub
//       .topic(topic)
//       .publisher()
//       .publish(dataBuffer)
//       .then(resolve)
//       .catch(reject)
//   }
// });

//decorator
export const cacheableFunc = (fn, name, expiration) => {
  return async function (...args) {
    const key = name + '/' + cacheKey(name + '?' + JSON.stringify(args));

    const cached: any = await (new Promise(resolve => {
      cacheDb.child(key).once('value', v => resolve(
        v.exists() ? v.val() : null,
      ));
    }));
    let _cacheable = cached !== null && (typeof cached.value !== 'undefined') && (cached.value !== null);
    if (_cacheable) {
      const now = (new Date()).getTime(),
        diff = now - cached.createdAt;
      if (diff > expiration * 1000)
        _cacheable = false;
    }
    if (_cacheable)
      return Promise.resolve(cached.value);

    return fn.apply(this, args).then(value => new Promise(resolve => {
      return cacheDb.child(key).update({
        fn: name,
        key,
        value,
        expiration: expiration * 1000,
        createdAt: (new Date()).getTime(),
      }).then(() => resolve(value));
    }));
  };
};

export const cacheable = (expiration = 86400) =>
  (target, name, descriptor) => {
    const original = descriptor.value;
    if (typeof original === 'function') {
      descriptor.value = cacheableFunc(original, name, expiration);
    }
    return descriptor;
  };
