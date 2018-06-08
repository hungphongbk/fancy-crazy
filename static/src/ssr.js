global.window = {
  Event: {},
  Element: class {
    matches() {
      return true;
    }
  }
};
global.document = {
  readyState: 'loading',
  addEventListener(type, listener) {
  }
};
export default async context => {
  const createApp = require('./universal').default;
  global.window.__state__ = context.__state__;
  return createApp();
}
