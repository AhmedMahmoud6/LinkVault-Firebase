import {
  login,
  getFriendlyErrorMessage,
  loginWithGoogle,
  loginWithGoogleRedirect,
  db,
} from "./firebase.js";
import {
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { setUserId } from "./user.js";

let emailInput = document.querySelector(".user-title");
let passwordInput = document.querySelector(".user-password");
let loginBtn = document.querySelector(".login-btn");
let loginFailed = document.querySelector(".login-failed");
let loginSuccess = document.querySelector(".login-success");
let continueWithGoogle = document.querySelector(".google");

loginBtn.addEventListener("click", async (_) => {
  let result = await login(emailInput.value, passwordInput.value);
  if (result.success) {
    setUserId(result.user.uid);
    loginSuccess.classList.remove("hidden");
    loginFailed.classList.add("hidden");
    setTimeout(() => {
      window.location.replace("index.html");
    }, 1000);
  } else {
    loginFailed.querySelector("p").textContent = getFriendlyErrorMessage(
      result.error
    );
    loginFailed.classList.remove("hidden");
    loginSuccess.classList.add("hidden");
  }
});

continueWithGoogle.addEventListener("click", async (_) => {
  loginWithGoogleRedirect();
});

(async () => {
  console.log("Checking Google redirect result...");

  let result = await loginWithGoogle();

  console.log("Redirect result:", result);

  if (result.success) {
    const uid = result.user.uid;
    await setDoc(doc(db, "users", uid), { idCounter: 0 });
    setUserId(uid);

    loginSuccess.classList.remove("hidden");
    loginFailed.classList.add("hidden");
    setTimeout(() => {
      window.location.replace("index.html");
    }, 1000);
  } else {
    loginFailed.querySelector("p").textContent = getFriendlyErrorMessage(
      result.error
    );
    loginFailed.classList.remove("hidden");
    loginSuccess.classList.add("hidden");
  }
})();
