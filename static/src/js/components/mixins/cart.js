export const cartMixin = {
  async mounted() {
    await this.$store.dispatch('cart/fetch');
  }
};
