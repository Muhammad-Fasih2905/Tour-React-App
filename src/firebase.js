// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth'
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import 'firebase/storage'
// const firebaseConfig = {
//   apiKey: "AIzaSyDfdNFVwgl_Nt_cw0Rw6852e7ysyLji37M",
//   authDomain: "fyp-webapp-91db9.firebaseapp.com",
//   databaseURL: "https://fyp-webapp-91db9-default-rtdb.firebaseio.com",
//   projectId: "fyp-webapp-91db9",
//   storageBucket: "fyp-webapp-91db9.appspot.com",
//   messagingSenderId: "1047136248795",
//   appId: "1:1047136248795:web:8b1879214f92b067b3fdfe"
// };

// const firebaseConfig = {
//   apiKey: "AIzaSyBUgRsu0uOtzVd7Br_CYyHpifI5M30zSLo",
//   authDomain: "great-expeditions.firebaseapp.com",
//   projectId: "great-expeditions",
//   storageBucket: "great-expeditions.appspot.com",
//   messagingSenderId: "470856617114",
//   appId: "1:470856617114:web:40f85debc339338af86323"
// };

const firebaseConfig = {
  apiKey: "AIzaSyB_Fpjva5ZcThekc3di9_iuw1CQhWaayDo",
  authDomain: "great-expeditions-9437d.firebaseapp.com",
  projectId: "great-expeditions-9437d",
  storageBucket: "great-expeditions-9437d.appspot.com",
  messagingSenderId: "787807149305",
  appId: "1:787807149305:web:5419c0b08a40d14a95d628"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Cloud Firestore and get a reference to the service
const auth = getAuth();
const storage = getStorage(app);

export { app, auth, db, storage };