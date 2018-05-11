import {Store} from 'vuex'

export default ({$mq}, store: Store) => {
  store.registerModule('mq', {
    namespaced: true,
    state: () => $mq
  })
}
