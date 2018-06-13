<style lang="scss" scoped>

</style>
<template lang="pug">
  v-layout
    v-flex(xs12)
      section.my-3
        h1.display-1.primary--text Reviews
      section
        v-tabs(v-model="tab")
          v-tab(href="#tab1") Index page
          v-tab(href="#tab2") Collection page
          v-tab(href="#tab3") Product page
      section
        v-tabs-items(v-model="tab")
          v-tab-item#tab1 foo
          v-tab-item#tab2
            //v-data-table(:headers="collectionTable.header", :items="collection_reviews" hide-actions)
            tab-collection(:header="collectionTable.header")
          v-tab-item#tab3 ahihi
</template>
<script>
  import {firebaseDb} from '../../plugins'
  import TabCollection from './indexCollections'

  export default {
    components:{
      TabCollection
    },
    data() {
      const header = (text, value, options = {}) => ({text, value, sortable: false, ...options});
      return {
        tab: '',
        collectionTable: {
          header: [
            header('ID', 'collection_id'),
            header('Position', 'position'),
          ]
        }
      }
    }
  }
</script>
