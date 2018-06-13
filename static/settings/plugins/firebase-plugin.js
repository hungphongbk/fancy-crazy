import Vue      from 'vue';
import VueFire  from 'vuefire';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

const app = firebase.initializeApp({
  apiKey: "AIzaSyAbMylvbRJQdhPbzhloGNHDBDujS-v34P4",
  authDomain: "fancycrazy-895ba.firebaseapp.com",
  databaseURL: "https://fancycrazy-895ba.firebaseio.com",
  projectId: "fancycrazy-895ba"
});
Vue.use(VueFire);

export default app.database();
