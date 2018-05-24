import Image         from './app__ReviewImage';
import ImageWithText from './app__ReviewImageText';
import style         from './app__Reviews.m-scss';
import store         from '@/js/store';

const types = {
  'image-only': Image,
  'image-with-data': ImageWithText
};

function storage(url, isPhone) {
  if (!/storage.googleapis.com/.test(url)) return url;
  return url.replace('w.jpg', (isPhone ? '-200w' : '-500w') + '.jpg');
}

export default {
  functional: true,
  render(h, {props, parent}) {
    const items = props.items;
    if (!items || items.length === 0) return (<div/>);

    if (props.notSlide === true) {
      const bs = parent.$bs;
      const items = props.items.slice(0,16).map((i, index) => (<div class={[style.item, index<12?style.small:style.big]}>
        <img class={bs.imgFluid} src={storage(i.image_url, store.state.mq.phone)}/>
      </div>));
      return (<div class={[bs.dFlex, bs.flexWrap]}>{items}</div>);
    }

    const Component = types[items[0].type];
    return (<Component items={items}/>);
  }
};
