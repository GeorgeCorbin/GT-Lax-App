// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJak9zA_a3gJPpGMZfmCOMld41DO9tEKM",
  authDomain: "gt-lax-app.firebaseapp.com",
  projectId: "gt-lax-app",
  storageBucket: "gt-lax-app.firebasestorage.app",
  messagingSenderId: "528602895294",
  appId: "1:528602895294:web:dcf180424e7ee3b8de5fef",
  measurementId: "G-WZH503D4C8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { analytics };
