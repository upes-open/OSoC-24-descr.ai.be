import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

const firebaseConfig = {
  // apiKey: process.env.FIREBASE_API_KEY,
  // authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  // projectId: process.env.FIREBASE_PROJECT_ID,
  // storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  // messagingSenderId: process.env.FIREBASE_MESSAGE_SENDER_ID,
  // appId: process.env.FIREBASE_APP_ID,
  // measurementId: process.env.FIREBASE_MESUREMENT_ID,
  // apiKey: "AIzaSyC8UBN_eFXjHAZRn3bY2vxCwAdzjdsJA2g",
  // authDomain: "descraibe-9e9a2.firebaseapp.com",
  // projectId: "descraibe-9e9a2",
  // storageBucket: "descraibe-9e9a2.appspot.com",
  // messagingSenderId: "957713950318",
  // appId: "1:957713950318:web:566fcc106c8dd982a2287f",
  // measurementId: "G-WFRNSRPZGM",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
