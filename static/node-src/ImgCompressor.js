// @flow
import Storage     from '@google-cloud/storage';
import credentials from './credentials/fancycrazy-895ba-firebase-adminsdk-c73dr-2f62366df5';
import mime        from 'mime-types';
import gm$         from 'gm';
import request     from 'request';
import imagemin    from 'imagemin';
import jpegtran    from 'imagemin-jpegtran';
import pngquant    from 'imagemin-pngquant';
import stringHash  from 'string-hash';

//region CONSTANTS
const gm = gm$.subClass({imageMagick: true});
const CLOUD_BUCKET = 'fancycrazy-895ba.appspot.com';
const plugins = [
  jpegtran({progressive: true}),
  pngquant({quality: '65-80'})
];
let cache: Storage.File[] = null;

//endregion

function getBucket(): Storage.Bucket {
  const storage = new Storage({
    credentials
  });
  return storage.bucket(CLOUD_BUCKET);
}

function getPublicUrl(filename) {
  return `https://storage.googleapis.com/${CLOUD_BUCKET}/${filename}`;
}

/**
 * Upload stream to GoogleCloud Storage
 * @param filename
 * @param buffer
 * @returns {Promise<any>}
 */
const uploadStream = (filename, buffer) => new Promise((resolve, reject) => {
  const contentType = mime.lookup(filename),
    file: Storage.File = getBucket().file(filename);

  const stream = file.createWriteStream({
    metadata: {
      contentType
    }
  });
  stream.on('error', reject);
  stream.on('finish', () => {
    file.makePublic().then(() => {
      resolve(getPublicUrl(filename.replace(/-[25]00/g, '')));
    });
  });
  stream.end(buffer);
});

const getFileInCache: (string => string | null) = url => {
  const file = cache.find(f => (new RegExp(stringHash(url))).test(f.name));
  if (file) {
    return getPublicUrl(file.name.replace(/-[25]00/g, ''));
  } else return null;
};

/**
 * Create Buffer from URL, resize & compress into 2 file streams. Then upload them into GC Storage
 * @param url
 */
const generateImageSet = async (url: String) => {
  if (cache === null) {
    cache = (await getBucket().getFiles())[0];
    console.log(`Cached ${cache.length} files`);
  }
  const hasCache = getFileInCache(url);
  if (hasCache) return hasCache;

  //resize to 2 difference sizes (by height)
  const heights = [200, 500];

  const filenameWithoutExt = stringHash(url);
  const transform = h => new Promise((resolve, reject) => {
    const filePath = `${filenameWithoutExt}-${h}w.jpg`,
      format = 'jpeg';

    //begin optimize
    gm(request(url))
      .resize(null, h)
      .noProfile()
      .sharpen(3, 0.8)
      .quality(h === 200 ? 60 : 70)
      .compress(format)
      .toBuffer(format, (err, data) => {
        if (err) {
          console.log('err unexpected on URL ' + url);
          reject(err);
        }
        else {
          imagemin.buffer(data, {plugins})
            .then(buf => uploadStream(filePath, buf))
            .then(resolve)
            .catch(reject);
        }
      });
  });

  try {
    const rs = await Promise.all(heights.map(transform));
    console.log('[GoogleCloud Storage] uploaded ' + rs[0]);
    return rs[0];
  } catch (e) {
    return url;
  }
};

export default {
  uploadStream,
  generateImageSet
};
