import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCybmXAUWgGDCMNQWvcRdaMgE31I1GkF8M",
  authDomain: "log-in-authentication-ac1b6.firebaseapp.com",
  projectId: "log-in-authentication-ac1b6",
  storageBucket: "log-in-authentication-ac1b6.appspot.com",
  messagingSenderId: "735126972855",
  appId: "1:735126972855:web:b26c16bd1de14bf361e032",
  measurementId: "G-3GKSESXV7S"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

const submitButton = document.getElementById("submit");
const signupButton = document.getElementById("sign-up");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const main = document.getElementById("main");
const createacct = document.getElementById("create-acct");

const signupEmailIn = document.getElementById("email-signup");
const confirmSignupEmailIn = document.getElementById("confirm-email-signup");
const signupPasswordIn = document.getElementById("password-signup");
const confirmSignUpPasswordIn = document.getElementById("confirm-password-signup");
const createacctbtn = document.getElementById("create-acct-btn");

const returnBtn = document.getElementById("return-btn");
const googleSignInButton = document.getElementById("google-sign-in");

let email, password, signupEmail, signupPassword, confirmSignupEmail, confirmSignUpPassword;

createacctbtn.addEventListener("click", function() {
  let isVerified = true;

  signupEmail = signupEmailIn.value;
  confirmSignupEmail = confirmSignupEmailIn.value;
  if (signupEmail != confirmSignupEmail) {
    window.alert("Email fields do not match. Try again.");
    isVerified = false;
  }

  signupPassword = signupPasswordIn.value;
  confirmSignUpPassword = confirmSignUpPasswordIn.value;
  if (signupPassword != confirmSignUpPassword) {
    window.alert("Password fields do not match. Try again.");
    isVerified = false;
  }

  if (!signupEmail || !confirmSignupEmail || !signupPassword || !confirmSignUpPassword) {
    window.alert("Please fill out all required fields.");
    isVerified = false;
  }

  if (isVerified) {
    createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
      .then(async (userCredential) => {
        const user = userCredential.user;
        await setDoc(doc(db, "users", user.uid), {
          email: signupEmail,
          createdAt: new Date()
        });
        window.alert("Success! Account created.");
        saveAuthDetailsLocally("signup", signupEmail, signupPassword);
        main.style.display = "block";
        createacct.style.display = "none";
      })
      .catch((error) => {
        const errorMessage = error.message;
        window.alert(`Error: ${errorMessage}`);
      });
  }
});

submitButton.addEventListener("click", function() {
  email = emailInput.value;
  password = passwordInput.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      window.alert("Success! Welcome back!");
      saveAuthDetailsLocally("signin", email, password);
    })
    .catch((error) => {
      const errorMessage = error.message;
      window.alert(`Error: ${errorMessage}`);
    });
});

signupButton.addEventListener("click", function() {
  main.style.display = "none";
  createacct.style.display = "block";
});

returnBtn.addEventListener("click", function() {
  main.style.display = "block";
  createacct.style.display = "none";
});

googleSignInButton.addEventListener("click", function() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then(async (result) => {
      const user = result.user;
      const userDoc = await getDoc(doc(db, "users", user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          createdAt: new Date()
        });
      }
      window.alert("Success! Signed in with Google.");
      saveAuthDetailsLocally("google-signin", user.email, "N/A");
    })
    .catch((error) => {
      const errorMessage = error.message;
      window.alert(`Error: ${errorMessage}`);
    });
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(`User signed in: ${user.email}`);
  } else {
    console.log("No user signed in.");
  }
});

function saveAuthDetailsLocally(action, email, password) {
  const authDetails = `Action: ${action}\nEmail: ${email}\nPassword: ${password}\n\n`;
  const blob = new Blob([authDetails], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'auth-details.txt';
  a.click();
  URL.revokeObjectURL(url);
}

