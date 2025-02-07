import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';

const firebaseConfig = {
  apiKey: "AIzaSyA1Yx0-iwYzgQryvR0GPHItDjjDV_XIQg4",
  authDomain: "prodnote-web.firebaseapp.com",
  projectId: "prodnote-web",
  storageBucket: "prodnote-web.firebasestorage.app",
  messagingSenderId: "806020565168",
  appId: "1:806020565168:web:46609243df9add11ae5375"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
