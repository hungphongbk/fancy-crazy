export default {
  computed:{
    menuList(){
      return this.$store.getters['menu/list'];
    }
  }
}
