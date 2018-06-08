export default () => {
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
}