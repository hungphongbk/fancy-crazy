import Vue from 'vue';
import Thumbnail from './thumbnail';
import Price from './price';
import Counter from './counter';
import NoSsr from 'vue-no-ssr';
//move chunk to frontend
import './universal/cart';
import './universal/modal';
import './universal/dropdown';


Vue.component('thumbnail', Thumbnail);
Vue.component('price', Price);
Vue.component('counter', Counter);
Vue.component('no-ssr', NoSsr);

export {default as ImagePair}   from './image-pair';
export {default as Slider}      from './slider';
export {default as ProductItem} from './ProductItem';
export {default as responsive}  from './responsive';
export {default as DataSource}  from './app__DataSource';
