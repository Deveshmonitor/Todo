import { initializeApp } from '@react-native-firebase/app';
import { getFirestore, collection, getDocs } from '@react-native-firebase/firestore';

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCK2jGc72lulbbUyglA0wT-FjDa8u2ozYc",
  authDomain: "Smart-Todo -Andriod",
  projectId: "smart-todo-andriod",
  storageBucket: "smart-todo-andriod.firebasestorage.app",
  messagingSenderId: "Y453816882468",
  appId: "1:453816882468:android:5cccfc41e1560209e80fb1"
};

// Firebase initialize
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db, collection, getDocs };
