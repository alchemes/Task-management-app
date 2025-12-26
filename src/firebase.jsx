import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  orderBy,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDi3J5KDZoX51LbF9nF4wv02wW03XM1CfA",
  authDomain: "task-management-237ce.firebaseapp.com",
  projectId: "task-management-237ce",
  storageBucket: "task-management-237ce.firebasestorage.app",
  messagingSenderId: "3701803306",
  appId: "1:3701803306:web:1ce628a09f416d599db653",
  measurementId: "G-GGY8M2LC04",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
  serverTimestamp,
  orderBy,
  setPersistence,
  browserLocalPersistence,
};
