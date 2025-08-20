
import { getDatabase } from "firebase/database"; // ✅ Add this
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAfk724kRc80OTNpI2Zv_HvGDekJGjiwnA",
    authDomain: "cooky-7441d.firebaseapp.com",
    projectId: "cooky-7441d",
    storageBucket: "cooky-7441d.firebasestorage.app",
    messagingSenderId: "957469473211",
    appId: "1:957469473211:web:fb84aa375e4cebf873ec9e",
    measurementId: "G-0CWLKZ5N1G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getDatabase(app);