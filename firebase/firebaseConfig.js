// Import the necessary Firebase services
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJak9zA_a3gJPpGMZfmCOMld41DO9tEKM",
  authDomain: "gt-lax-app.firebaseapp.com",
  projectId: "gt-lax-app",
  storageBucket: "gt-lax-app.appspot.com", // Fixed typo in storage bucket
  messagingSenderId: "528602895294",
  appId: "1:528602895294:web:dcf180424e7ee3b8de5fef",
  measurementId: "G-WZH503D4C8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Analytics
let analytics;
isSupported()
  .then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
      console.log("Firebase Analytics initialized");
    } else {
      console.warn("Firebase Analytics not supported in this environment.");
    }
  })
  .catch((error) => {
    console.error("Error checking Analytics support:", error);
  });

// Storage
const storage = getStorage(app);

// Firestore
const db = getFirestore(app);

export { analytics, storage, db };
