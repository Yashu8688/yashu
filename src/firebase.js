import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// IMPORTANT: This is a temporary solution for debugging.
// Storing API keys directly in the code is not recommended.
const firebaseConfig = {
  apiKey: "AIzaSyCgo_6PdguGtCkbelyUvYAxc1jqGYHIIjw",
  authDomain: "voyloo-190a9.firebaseapp.com",
  projectId: "voyloo-190a9",
  storageBucket: "voyloo-190a9.firebasestorage.app",
  messagingSenderId: "41844885212",
  appId: "1:41844885212:web:a8129bf4c1576459f65619"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage };
