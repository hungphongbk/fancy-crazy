import Slick    from './slider-Slick';
import Flickity from './slider-Flickity';

const types = {
  slick: Slick,
  flickity: Flickity
};

export default {
  functional: true,
  render(h, {props, data, children}) {
    const type = props.type || 'slick';
    return h(types[type], data, children);
  },
  props: {
    type: String
  }
};
