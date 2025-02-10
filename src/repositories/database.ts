import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: "AIzaSyAXSxQt2bvHXD5C4k9cgiQ9gBuS5Zbb3so",
  authDomain: "invpoint-9c3f6.firebaseapp.com",
  databaseURL: "https://invpoint-9c3f6-default-rtdb.firebaseio.com",
  projectId: "invpoint-9c3f6",
  storageBucket: "invpoint-9c3f6.firebasestorage.app",
  messagingSenderId: "528563975119",
  appId: "1:528563975119:web:62edd5485f4c1affc2d8ba"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
