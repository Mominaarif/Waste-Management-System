// firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDaXAQuwUo6cJQeNDG9PrOCh2rX5fS0fbQ",
  authDomain: "solidwastemanagement-8c8cf.firebaseapp.com",
  projectId: "solidwastemanagement-8c8cf",
  storageBucket: "solidwastemanagement-8c8cf.firebasestorage.app",
  messagingSenderId: "273483900088",
  appId: "1:273483900088:web:dcc95680e6787e80ce404d",
  measurementId: "G-H88PESKRGQ"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const auth = getAuth(app);
const db = getFirestore(app); 
const storage = getStorage(app);

export {db, auth, database, storage, createUserWithEmailAndPassword };
