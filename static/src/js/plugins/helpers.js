import zipObj from 'lodash/zipObject'
const spreadModuleProps = (module, props) => zipObj(props, props.map(prop => module + '/' + prop))

export {spreadModuleProps}
