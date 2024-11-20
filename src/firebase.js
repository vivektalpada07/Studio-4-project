import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA8rjGG3MIYtDjSnZRDaIKnCD6l46ybW-Y",
  authDomain: "eco-shop-60df7.firebaseapp.com",
  projectId: "eco-shop-60df7",
  storageBucket: "eco-shop-60df7.appspot.com",
  messagingSenderId: "292693377073",
  appId: "1:292693377073:web:3a88b142c8a2889242d510"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
// Initialize Firestore and get a reference to the service
export const db = getFirestore(app);
export const storage =  getStorage(app);
export default app;
