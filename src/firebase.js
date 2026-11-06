import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getFunctions } from 'firebase/functions'; // <-- add thi

const firebaseConfig = {
  apiKey: "AIzaSyBWGU9-U2U3IwheDBPLR_QoeC10Tm462lg",
  authDomain: "dollar-eda6d.firebaseapp.com",
  projectId: "dollar-eda6d",
  storageBucket: "dollar-eda6d.firebasestorage.app",
  messagingSenderId: "590106993716",
  appId: "1:590106993716:web:9ad9300e9570db2a1f1661",
  measurementId: "G-K7GCR81SYJ"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const functions = getFunctions(app);                 // Initialize functions

export { auth, db, storage, functions };