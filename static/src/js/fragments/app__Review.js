import Image         from './app__ReviewImage';
import ImageWithText from './app__ReviewImageText';

const types = {
  'image-only': Image,
  'image-with-data': ImageWithText
};

export default {
  functional: true,
  render(h, {props}) {
    const items = props.items;
    if (!items || items.length === 0) return (<div/>);

    const Component = types[items[0].type];
    return (<Component items={items}/>);
  }
};
