// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, collection } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDaXz7mzdWhkjZVYKiQVZ42xOPFIUYdXFI",
  authDomain: "coffee-and-convos.firebaseapp.com",
  projectId: "coffee-and-convos",
  storageBucket: "coffee-and-convos.appspot.com",
  messagingSenderId: "148684998563",
  appId: "1:148684998563:web:55b15a4f315b1bb7be7c16",
  measurementId: "G-DT21HHQG7H",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, provider, auth, analytics, storage };
