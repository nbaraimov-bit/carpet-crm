import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDsE61F0Ze7jJffA7XapF112oZmpmSTmBM",
  authDomain: "carpet-crm-1fc8a.firebaseapp.com",
  projectId: "carpet-crm-1fc8a",
  storageBucket: "carpet-crm-1fc8a.firebasestorage.app",
  messagingSenderId: "216085452494",
  appId: "1:216085452494:web:fc7751aead7a62d29ae29f"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);