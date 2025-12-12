// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgo_6PdguGtCkbelyUvYAxc1jqGYHIIjw",
  authDomain: "voyloo-190a9.firebaseapp.com",
  projectId: "voyloo-190a9",
  storageBucket: "voyloo-190a9.appspot.com",
  messagingSenderId: "41844885212",
  appId: "1:41844885212:web:a8129bf4c1576459f65619",
  measurementId: "G-8FNQHR9S4H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
