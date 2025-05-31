import {
  register,
  db,
  getFriendlyErrorMessage,
  loginWithGoogle,
} from "./firebase.js";
import {
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js";
import { setUserId } from "./user.js";

let emailInput = document.querySelector(".user-title");
let passwordInput = document.querySelector(".user-password");
let registerBtn = document.querySelector(".register-btn");
let registerFailed = document.querySelector(".register-failed");
let registerSuccess = document.querySelector(".register-success");
let continueWithGoogle = document.querySelector(".google");

registerBtn.addEventListener("click", async (_) => {
  let result = await register(emailInput.value, passwordInput.value);
  if (result.success) {
    const uid = result.user.uid;
    await setDoc(doc(db, "users", uid), { idCounter: 0 });

    registerSuccess.classList.remove("hidden");
    registerFailed.classList.add("hidden");
    setTimeout(() => {
      window.location.replace("login.html");
    }, 1000);
  } else {
    registerFailed.querySelector("p").textContent = getFriendlyErrorMessage(
      result.error
    );
    registerFailed.classList.remove("hidden");
    registerSuccess.classList.add("hidden");
  }
});

continueWithGoogle.addEventListener("click", async (_) => {
  let result = await loginWithGoogle();

  if (result.success) {
    const uid = result.user.uid;
    await setDoc(doc(db, "users", uid), { idCounter: 0 });
    setUserId(uid);

    registerSuccess.classList.remove("hidden");
    registerFailed.classList.add("hidden");
    setTimeout(() => {
      window.location.replace("index.html");
    }, 1000);
  } else {
    registerFailed.querySelector("p").textContent = getFriendlyErrorMessage(
      result.error
    );
    registerFailed.classList.remove("hidden");
    registerSuccess.classList.add("hidden");
  }
});
