import grid   from './app__DataSource-grid';
import slider from './app__DataSource-slider';

export default {
  functional: true,
  render(h, {props, data, children}) {
    const component = {
      grid,
      slider
    }[props.type];
    component.mixins = [{
      props: {
        dataSource: {
          type: Array,
          required: true
        }
      }
    }];
    return h(component, data, children);
  },
  props: {
    type: {
      type: String,
      default: 'grid'
    }
  }
};
