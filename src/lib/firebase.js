import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyB924Erz1NgtqLM3xf99XuVUwpLs0B7FX4",
  authDomain: "sales-lababil.firebaseapp.com",
  projectId: "sales-lababil"
  storageBucket: "sales-lababil.firebasestorage.app",
  messagingSenderId: "852722513229",
  appId: "1:852722513229:web:ca54ca364b5771dc567304",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Export app untuk kebutuhan lain
export default app;
Terminal Sessions

