import Vue        from 'vue';
import VueFilters from 'vue2-filters';

Vue.use(VueFilters);

Vue.filter('secure', url => url.replace('http:/', 'https:/'));

const shopifyImgUrl = (_url, size = '', appendCdn = true) => {
  if (typeof _url === 'undefined') return '';
  const sizes = 'thumb,small,compact,medium,large,grande,original,master'.split(','),
    sizeRegex = new RegExp(sizes.join('|'));

  let url = _url;
  if (size.length > 0) {
    url = url.replace(new RegExp(`(_(${sizeRegex}))?\.(jpg|jpeg|png)`), size === 'master' ? '.$3' : `_${size}.$3`);
  }
  if (/^\/\/cdn\.shopify\.com/.test(url) || !appendCdn) return url;
  return '//cdn.shopify.com' + url;
};

const shopifyImgUrls = (urls, size = '') => urls.map(url => shopifyImgUrl(url, size));

const usd = (value) => {
  if (!value) return '';
  return '$' + (value / 100).toLocaleString("en-US");
};

export {shopifyImgUrl, shopifyImgUrls, usd};
