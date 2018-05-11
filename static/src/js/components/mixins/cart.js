export const cartMixin = {
  async created() {
    await this.$store.dispatch('cart/fetch');
  }
};
