// firebase-config.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getAuth, 
    GoogleAuthProvider, 
    OAuthProvider, 
    signInWithPopup, 
    onAuthStateChanged,
    RecaptchaVerifier, 
    signInWithPhoneNumber 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// DIQQAT: getDatabase emas, getFirestore ishlatilishi shart!
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDc-kYemWOasjaYyLc5x0TVDxe93Jls2z8",
    authDomain: "torvex-xxxx.firebaseapp.com", 
    projectId: "torvex-xxxx",
    storageBucket: "torvex-xxxx.firebasestorage.app",
    messagingSenderId: "999014412743",
    appId: "1:999014412743:web:1f061f466263c7b86769e2",
    measurementId: "G-GTKR6M4Q5C"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Eksportlar
export const auth = getAuth(app);
// Firestore ma'lumotlar bazasini eksport qilish
export const db = getFirestore(app); 

// Provayderlar
export const googleProvider = new GoogleAuthProvider();
export const appleProvider = new OAuthProvider('apple.com');

// Metodlarni eksport qilish (script.js taniy olishi uchun)
export { 
    signInWithPopup, 
    onAuthStateChanged, 
    RecaptchaVerifier, 
    signInWithPhoneNumber 
};