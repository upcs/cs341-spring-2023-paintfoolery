import firebase from 'firebase/app';
import 'firebase/firestore';


const firebaseConfig = {

  apiKey: "AIzaSyBQYb6hi0bNHIrHkGL2mdKFL1lnhMFwXeU",

  authDomain: "paint-46970.firebaseapp.com",

  databaseURL: "https://paint-46970-default-rtdb.firebaseio.com",

  projectId: "paint-46970",

  storageBucket: "paint-46970.appspot.com",

  messagingSenderId: "54402484337",

  appId: "1:54402484337:web:4b9d1cb00e07cd578df3d0",

  measurementId: "G-Y9P77GNJTH"

};

//Might need this might not
// if(firebase.apps.length == 0){
//   firebase.initializeApp(firebaseConfig);  
// }
// this.db = firebase.firestore();
// this.userList = [];
// }

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

export default db;
