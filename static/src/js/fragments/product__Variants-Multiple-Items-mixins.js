export default {
  props: {
    items: {
      type: Array,
      default: () => [],
      required: true
    },
    type: {
      type: String,
      required: true
    },
    value: null
  },
  created() {
    this.$emit('input', this.items[0])
  }
}
