const firebaseConfig = {
  // Place you firebase config here
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.firestore();

const form = document.querySelector("form");
const nameInput = document.querySelector('input[placeholder="Full Name"]');
const emailInput = document.querySelector('input[type="email"]');
const passwordInput = document.querySelector('input[placeholder="Password"]');
const confirmPasswordInput = document.querySelector(
  'input[placeholder="Confirm Password"]'
);
const submitButton = document.querySelector('button[type="submit"]');
const googleButton = document.querySelector(".social-btn.google");
const facebookButton = document.querySelector(".social-btn.facebook");
const appleButton = document.querySelector(".social-btn.apple");

// login or register page
const isLoginPage = !nameInput && !confirmPasswordInput;
console.log(isLoginPage);

async function addUserToFirestore(user, additionalData = {}) {
  try {
    await db
      .collection("users")
      .doc(user.uid)
      .set(
        {
          name: user.displayName || additionalData.name,
          email: user.email,
          ...additionalData,
        },
        { merge: true }
      );
  } catch (error) {
    console.error("Error adding user to Firestore: ", error);
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  try {
    if (isLoginPage) {
      // Login
      await auth.signInWithEmailAndPassword(email, password);
      alert("Logged in successfully!");
    } else {
      // Register
      const name = nameInput.value;
      const confirmPassword = confirmPasswordInput.value;

      if (password !== confirmPassword) {
        alert("Passwords don't match");
        return;
      }

      const userCredential = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      const user = userCredential.user;
      await user.updateProfile({ displayName: name });
      await addUserToFirestore(user, { name });
      alert("Account created successfully!");
    }
    // Redirect to home page or dashboard
    // window.location.href = 'dashboard.html';
  } catch (error) {
    alert(error.message);
  }
});

async function socialSignIn(provider) {
  try {
    const result = await auth.signInWithPopup(provider);
    const user = result.user;
    await addUserToFirestore(user);
    alert(`Signed in with ${provider.providerId} successfully!`);
    // Redirect to home page or dashboard
    // window.location.href = 'dashboard.html';
  } catch (error) {
    alert(error.message);
  }
}

// Google Sign-in
googleButton.addEventListener("click", () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  socialSignIn(provider);
});

// Facebook Sign-in
facebookButton.addEventListener("click", () => {
  const provider = new firebase.auth.FacebookAuthProvider();
  socialSignIn(provider);
});

// Apple Sign-in
appleButton.addEventListener("click", () => {
  const provider = new firebase.auth.OAuthProvider("apple.com");
  socialSignIn(provider);
});

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("User is signed in:", user);
  } else {
    console.log("No user is signed in.");
  }
});
