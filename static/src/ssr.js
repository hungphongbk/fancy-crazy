import createApp from './universal';

export default context => {
  global.window.__state__ = {
    template: 'index'
  };
  createApp();
}
