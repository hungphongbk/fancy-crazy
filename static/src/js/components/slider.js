import Flickity from './slider-Flickity';

const types = {
  flickity: Flickity
};

export default {
  functional: true,
  render(h, {props, data, children}) {
    const type = props.type || 'flickity';
    return h(types[type], data, children);
  },
  props: {
    type: String
  }
};
