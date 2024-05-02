// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "gibra-blog.firebaseapp.com",
  projectId: "gibra-blog",
  storageBucket: "gibra-blog.appspot.com",
  messagingSenderId: "1093637987319",
  appId: "1:1093637987319:web:ccefdc56d5761dc04c2cf2",
  measurementId: "G-V3FSGXYK54"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);