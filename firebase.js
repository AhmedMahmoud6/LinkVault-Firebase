import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import {
  getAuth,
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

export { db, auth };

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
    return { success: false, error: error.message };
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
    console.error("Login Error:", error.message);
    return { success: false, error: error.message };
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
