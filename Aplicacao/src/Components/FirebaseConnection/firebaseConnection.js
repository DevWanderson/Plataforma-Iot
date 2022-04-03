import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';


let firebaseConfig = {
    apiKey: "AIzaSyAvYUBSED7D5BoDWwPVJa7jsVP8rLQzdqo",
    authDomain: "plataformaiot-64c64.firebaseapp.com",
    databaseURL: "https://plataformaiot-64c64-default-rtdb.firebaseio.com",
    projectId: "plataformaiot-64c64",
    storageBucket: "plataformaiot-64c64.appspot.com",
    messagingSenderId: "800863963175",
    appId: "1:800863963175:web:e3317b573e629a43726602",
    measurementId: "G-QJRT4QQ8QQ"
  };
  // Initialize Firebase
  if(!firebase.apps.length){
      firebase.initializeApp(firebaseConfig);
  }
  //firebase.analytics();

  export default firebase