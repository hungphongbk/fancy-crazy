import store from '@/js/store';

export default (Mobile, Desktop) => ({
  functional: true,
  render: (h, {data, children}) => {
    if (store.state.mq.phone) return h(Mobile, data, children);
    return h(Desktop, data, children);
  }
})
