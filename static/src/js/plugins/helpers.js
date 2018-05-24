import zipObj from 'lodash/zipObject';

const spreadModuleProps = (module, props) => zipObj(props, props.map(prop => module + '/' + prop));

const assert = (obj, requireType = null) => {
  if (typeof obj === 'undefined' || obj === null) return false;
  return true;
};

export {spreadModuleProps, assert};
