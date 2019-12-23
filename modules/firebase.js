const Firebase=require('firebase');
const keys=require('../config/keys.json');

const config={
    apiKey: keys.apiKey,
    authDomain: keys.authDomain,
    databaseURL: keys.databaseURL,
    storageBucket: keys.storageBucket,
    messagingSenderId: keys.messagingSenderId,
  }

const firebase = Firebase.initializeApp(config);
module.exports=firebase;