<style lang="scss" scoped>

</style>
<template lang="pug">
  v-data-table(:headers="header", :items="reviews" hide-actions)
    template(slot="items" slot-scope="{item}")
      td {{item.collection_id}}
      td {{item.position}}
</template>
<script>
  import {firebaseDb} from '../../plugins'

  export default {
    props: {
      header: {
        type: Array,
        required: true
      }
    },
    firebase: {
      reviews: {
        source: firebaseDb.ref('server/reviews').limitToLast(400),
        readyCallback() {
          console.log('ok');
        }
      }
    }
  }
</script>
