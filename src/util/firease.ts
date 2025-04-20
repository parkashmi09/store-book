
// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyDvmSHtJq10HpCMlgTebxmL8dz2aM478mk",
    authDomain: "targetboard-store.firebaseapp.com",
    projectId: "targetboard-store",
    storageBucket: "targetboard-store.appspot.com",
    messagingSenderId: "765061151573",
    appId: "1:765061151573:web:371ec14f3da7eebabd8ddc",
    measurementId: "G-7Q6RH3PJYJ"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;
