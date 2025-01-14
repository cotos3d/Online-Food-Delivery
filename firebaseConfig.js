import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCPsZ8NEPzmhFKcs7KxE7Srp9rW5VBCQ0w",
  authDomain: "deliveri-12b33.firebaseapp.com",
  projectId: "deliveri-12b33",
  storageBucket: "deliveri-12b33.appspot.com",
  messagingSenderId: "361820816244",
  appId: "1:361820816244:web:89214d4589294f0f82e221",
  measurementId: "G-1TJY2EWPG1"
};

const appFirebase = initializeApp(firebaseConfig);

const auth = getAuth(appFirebase); 
const db = getFirestore(appFirebase); 
const storage = getStorage(appFirebase); 

export { appFirebase, auth, db, storage };