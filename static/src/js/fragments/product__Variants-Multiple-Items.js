import Color from './product__Variants-Multiple-Items-Color';
import Size from './product__Variants-Multiple-Items-Size';
import General from './product__Variants-Multiple-Items-General';

export default {
  functional: true,
  render: (h, {props, data}) => {
    const Tag = (() => {
      switch (props.type.toLowerCase()) {
        case'color':
          return Color;
        case 'size':
          return Size;
        default:
          return General;
      }
    })();
    return (<Tag {...data}/>);
  }
};
