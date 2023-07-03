// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import {getStorage} from "firebase/storage"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBgiwwQkbmq4koK05N9JzzM0BDGMH2Oiso",
  authDomain: "festa-on.firebaseapp.com",
  projectId: "festa-on",
  storageBucket: "festa-on.appspot.com",
  messagingSenderId: "118443597810",
  appId: "1:118443597810:web:643693346c152c1c7cd56b",
  measurementId: "G-8VZ57QJ7S2"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);


const auth = firebase.auth(app)
const storage = getStorage(app)
auth.languageCode = "pt-br"
export {auth, storage} 