import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCJ5D60YYSDLU5t4F85E2hAGwJtZJdIf6U",
  authDomain: "link-vault-a66ac.firebaseapp.com",
  projectId: "link-vault-a66ac",
  storageBucket: "link-vault-a66ac.firebasestorage.app",
  messagingSenderId: "697967244628",
  appId: "1:697967244628:web:b062cb6cdccdcb764904c1",
  measurementId: "G-QDBDXE7H6F",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

export { db, auth, googleProvider };

export async function register(email, password) {
  try {
    let userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("Registered:", userCredential.user.email);

    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Registration Error:", error.message);
    return { success: false, error: error.code };
  }
}

export async function login(email, password) {
  try {
    let userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    console.log("Logged in:", userCredential.user.email);
    return { success: true, user: userCredential.user };
  } catch (error) {
    console.error("Login Error:", error.code);
    return { success: false, error: error.code };
  }
}

export async function logout() {
  try {
    await signOut(auth);
    console.log("Logged out");
    // Redirect or update UI
    window.location.reload();
  } catch (error) {
    console.error("Logout Error:", error.message);
  }
}

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("Google User:", user.email);
    return { success: true, user };
  } catch (error) {
    console.error("Google Login Error:", error.code, error.message);
    return { success: false, error: error.code };
  }
}

export function getFriendlyErrorMessage(error) {
  if (!error) return "Something went wrong. Please try again.";

  const map = {
    "auth/email-already-in-use": "This email is already in use.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/missing-password": "Please enter a password.",
    "auth/user-not-found": "No account found with this email.",
    "auth/invalid-credential": "Incorrect Email or password. Please try again.",
    "auth/too-many-requests":
      "Too many attempts. Please wait a moment and try again.",
  };

  return map[error] || "An unknown error occurred.";
}
