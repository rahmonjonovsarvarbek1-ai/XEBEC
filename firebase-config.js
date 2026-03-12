// firebase-config.js
// firebase-config.js
// firebase-config.js faylida:
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth, GoogleAuthProvider } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
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

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();