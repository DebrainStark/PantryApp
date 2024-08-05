// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAHHyBtmmS5eMHF1qsRfavPNGh0Um3zSmM",
  authDomain: "hspantry-app-9617b.firebaseapp.com",
  projectId: "hspantry-app-9617b",
  storageBucket: "hspantry-app-9617b.appspot.com",
  messagingSenderId: "390894484598",
  appId: "1:390894484598:web:fabfa904afb9c8aca97357"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)
export {app, firestore}