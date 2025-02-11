import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCaYJHh0pkWIjI6v9BwME_KCiSORUC0Ock",
  authDomain: "prodnote-dev-2b51d.firebaseapp.com",
  projectId: "prodnote-dev-2b51d",
  storageBucket: "prodnote-dev-2b51d.firebasestorage.app",
  messagingSenderId: "438517463783",
  appId: "1:438517463783:web:b4fd27b339b6548ba00042"
}

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
