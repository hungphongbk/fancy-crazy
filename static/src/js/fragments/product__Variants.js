import Single from './product__Variants-Single'
import Multiple from './product__Variants-Multiple'

export default {
  name: 'ProductVariants',
  functional: true,
  render: (h, {props, data}) => {
    if (props.options.length === 1)
      return (<Single {...data} />);
    return (<Multiple {...data} options={props.options}/>)
  },
  props: {
    options: {
      type: Array,
      default: () => []
    }
  }
}
