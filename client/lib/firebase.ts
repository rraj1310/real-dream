import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCQbsf-dAxKOpIwsZR0KDSzWzOi3Sptmzk",
  authDomain: "my-real-dream.firebaseapp.com",
  projectId: "my-real-dream",
  storageBucket: "my-real-dream.firebasestorage.app",
  messagingSenderId: "758670350516",
  appId: "1:758670350516:web:a9e570da0a31582f299fe1",
};

const app =
  getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
