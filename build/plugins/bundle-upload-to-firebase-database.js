import database from '../../functions/firebase/database.babel';
import md5      from 'md5';

export default {
  apply(compiler) {
    compiler.plugin('emit', async (compilation, callback) => {
      // console.log(compilation.assets['vue-ssr-server-bundle.json'].source());
      await Promise.all(
        Object.entries(compilation.assets).map(([name, asset]) => {
          const source = asset.source();
          return database.ref('server/ssr-bundle').set({
            name,
            source,
            hash: md5(source),
            size: asset.size()
          });
        }));
      console.log('Firebase: successfully upload bundle to firebase database');
      callback();
    });
  }
};
