
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB6LLuaSA4snetiBlYCroWfSE8DZUYPaU8",
    authDomain: "bankingapp-10b5a.firebaseapp.com",
    projectId: "bankingapp-10b5a",
    storageBucket: "bankingapp-10b5a.appspot.com",
    messagingSenderId: "1061867899935",
    appId: "1:1061867899935:web:2440f331d084f7a86d992a",
    measurementId: "G-5KX1QL90WH"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Export auth and db
export { auth, db };
