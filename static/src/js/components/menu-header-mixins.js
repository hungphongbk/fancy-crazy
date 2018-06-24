import {GLOBAL_EVENTS} from "@/js/plugins";

export default {
  data: () => ({
    BOX_SHADOW_Y_OFFSET: 0
  }),
  computed: {
    menuList() {
      return this.$store.getters['menu/list'];
    },
    NAVBAR_BOX_SHADOW() {
      const value = `0 ${this.BOX_SHADOW_Y_OFFSET - 4}px 10px -3px rgba(0,0,0,0.65)`;
      return {
        'box-shadow': value,
        '-webkit-box-shadow': value,
        '-moz-box-shadow': value
      };
    }
  },
  created() {
    GLOBAL_EVENTS.$on('scroll', value => {
      this.BOX_SHADOW_Y_OFFSET = value * 4;
    })
  }
};
