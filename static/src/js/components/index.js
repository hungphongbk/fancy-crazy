import Vue       from 'vue';
import Thumbnail from './thumbnail';
import Price     from './price';
import Counter   from './counter';

console.log(__state__.pageProduct);
Vue.component('thumbnail', Thumbnail);
Vue.component('price', Price);
Vue.component('counter', Counter);

export {default as ImagePair}   from './image-pair';
export {default as Slider}      from './slider';
export {default as ProductItem} from './ProductItem';

//move chunk to frontend
import './universal/cart'
import './universal/modal'
