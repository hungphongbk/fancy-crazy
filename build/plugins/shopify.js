import _                      from 'lodash';
import Shopify                from 'shopify-api-node';
import {createBundleRenderer} from 'vue-server-renderer';
import path                   from 'path';

const shopify = new Shopify({
  shopName: 'cubachtung.myshopify.com',
  apiKey: 'fbe0d0ae67119ada8e18e0bdfcfb4eb3',
  password: '7f6a7e330da245f0049ff3a642e3abdc'
});

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p);
  // application specific logging, throwing an error, or other logic here
});

export default {
  apply(compiler) {
    compiler.plugin('emit', async (compilation, callback) => {
      const picks = ['frontend', 'vendor', 'inline'],
        isBeginWith = file => picks.reduce(
          (acc, f) => acc |= file.startsWith(f),
          false
        );

      const files = _.chain(compilation.chunks.map(chunk => chunk.files))
        .flatten()
        .filter(isBeginWith)
        .value();

      const metaList = await shopify.metafield.list({
        namespace: 'fancyCrazySrc'
      });

      await Promise.all(files.map(async file => {
        let [_key, value] = file.split('?'),
          key = _key.replace('.', '_'),
          m = metaList.find(m => m.key === _key);

        if (_key.startsWith('inline') || _key.startsWith('frontend.css'))
          value = compilation.assets[file].source();

        if (!m) {
          await shopify.metafield.create({
            namespace: 'fancyCrazySrc',
            key,
            value,
            value_type: 'string'
          });
        } else {
          await shopify.metafield.update(m.id, {
            value
          });
        }

        console.log('done ' + file);
      }));

      //generate ssr context for index page
      global.window = {
        Event: {},
        Element: class {
          matches() {
            return true;
          }
        }
      };
      global.document = {
        readyState: 'loading',
        addEventListener(type, listener) {
        }
      };
      const renderer = createBundleRenderer(path.resolve(__dirname, '../../static/vue-ssr-server-bundle.json'), {
        runInNewContext: false
      });
      const html = await renderer.renderToString();
      console.log("SSR generated size: "+Math.round(html.length*100/1024)/100+'KB');

      callback();
    });
  }
};
