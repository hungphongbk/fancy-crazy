// import admin from 'firebase-admin';
const admin = require('firebase-admin'),
  cert = require('../app/cred/fancycrazy-895ba-firebase-adminsdk-c73dr-732b028be2');

admin.initializeApp({
  credential: admin.credential.cert(cert),
  databaseURL: "https://fancycrazy-895ba.firebaseio.com",
});

module.exports = admin.database();
