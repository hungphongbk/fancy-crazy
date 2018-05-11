import Image         from './app__ReviewImage';
import ImageWithText from './app__ReviewImageText';

const types = {
  'image-only': Image,
  'image-with-text': ImageWithText
};

export default {
  functional: true,
  render(h, {props}) {
    const items = props.items;
    if (!items) return (<div/>);

    const Component = types[items[0].type];
    return (<Component items={items}/>);
  }
};
