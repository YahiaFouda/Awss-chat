
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyBVyNocxUphTQwpStTWM8blNxlnK_FVcSY",
    authDomain: "awss-5bf8d.firebaseapp.com",
    projectId: "awss-5bf8d",
    storageBucket: "awss-5bf8d.appspot.com",
    messagingSenderId: "748725739930",
    appId: "1:748725739930:web:1a0c2c50cc22e0bbc25a23",
    measurementId: "G-Q9D7P9DV8Q"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
export const auth = getAuth();
export const storage = getStorage();

