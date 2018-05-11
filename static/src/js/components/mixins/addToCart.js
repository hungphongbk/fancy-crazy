export const addToCart = {
  methods:{
    async addToCart(id) {
      await this.$store.dispatch('cart/addToCart', {id});
    }
  }
};
