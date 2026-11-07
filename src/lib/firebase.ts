import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBa2zLaeU_DD6pKO62guRUD4Ijd8RkYOJc",
  authDomain: "gaming-relax-programmazione.firebaseapp.com",
  projectId: "gaming-relax-programmazione",
  storageBucket: "gaming-relax-programmazione.firebasestorage.app",
  messagingSenderId: "959071907341",
  appId: "1:959071907341:web:86a4fdbb36ab596e63ef44",
  measurementId: "G-27J7PF8YLM",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

export const storage = getStorage(
  app,
  "gs://gaming-relax-programmazione.firebasestorage.app"
);

export default app;
