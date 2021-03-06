const Desktop = () => import( /* webpackChunkName: "desktop" */ './desktop/image-pair');
import store from '@/js/store';

export default {
  functional: true,
  render(h, {props, data, children, parent}) {
    if (store.state.mq.phone)
      return (<img class={parent.$bs.imgFluid} v-lazy={props.srcset[0]}/>);
    return h(
      SSR === 'client' ? Desktop : require('./desktop/image-pair').default
      , data, children);
  }
};
