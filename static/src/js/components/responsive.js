import store from '@/js/store';

export default (Mobile, Desktop) => ({
  name: 'site-header',
  functional: true,
  render: (h, {data, children}) => {
    if (store.state.mq.phone) return h(Mobile, data, children);
    return h(Desktop, data, children);
  }
})
//
// export default (Mobile, Desktop) => {
//   console.log(store.state);
//   return store.state.mq.phone ? Mobile : Desktop
// };
