import firebase from 'firebase/app';
import 'firebase/firestore';

const firebaseConfig = {
  // Your Firebase config goes here
};

firebase.initializeApp();

const db = firebase.firestore();

export default db;
