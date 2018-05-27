import _       from 'lodash';
import Shopify from 'shopify-api-node';

const shopify = new Shopify({
  shopName: 'cubachtung.myshopify.com',
  apiKey: 'fbe0d0ae67119ada8e18e0bdfcfb4eb3',
  password: '7f6a7e330da245f0049ff3a642e3abdc'
});

export default {
  apply(compiler) {
    compiler.plugin('emit', async compilation => {
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
        const [_key, value] = file.split('?'),
          key = _key.replace('.', '_'),
          m = metaList.find(m => m.key === _key);

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
    });
  }
};
