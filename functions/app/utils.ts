import admin from 'firebase-admin';
import cert  from './cred/fancycrazy-895ba-firebase-adminsdk-c73dr-2f62366df5.json';
import md5   from 'md5';

admin.initializeApp({
  credential: admin.credential.cert(cert),
  databaseURL: "https://fancycrazy-895ba.firebaseio.com",
});

const db = admin.database(),
  cacheDb = db.ref('server/cache');

const cacheKey = key => md5(key);

//decorator
export const cacheable = (expiration = 86400) =>
  (target, name, descriptor) => {
    const original = descriptor.value;
    if (typeof original === 'function') {
      descriptor.value = async function (...args) {
        const key = cacheKey(name + '?' + JSON.stringify(args));

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

        return original.apply(this, args).then(value => new Promise(resolve => {
          return cacheDb.child(key).update({
            value,
            expiration: expiration * 1000,
            createdAt: (new Date()).getTime(),
          }).then(() => resolve(value));
        }));
      };
    }
    return descriptor;
  };
